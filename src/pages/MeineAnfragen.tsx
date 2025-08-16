import React, { useEffect, useState } from 'react';
import { HiCalendar, HiLocationMarker, HiClock, HiCurrencyEuro } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

type Status = 'angefragt' | 'angeboten' | 'akzeptiert' | 'abgelehnt' | 'storniert';

interface Anfrage {
  id: number | string;
  event_type: string;
  show_type: string;
  event_date: string; // YYYY-MM-DD
  event_time: string; // HH:MM:SS
  event_address: string;
  duration_minutes: number;
  number_of_guests: number;
  is_indoor: boolean;
  recommended_price_min: number;
  recommended_price_max: number;
  show_discipline: string;
  special_requests: string;
  status: Status | string;
  team_size: string | number;
  artist_gage?: number;           
  artist_offer_date?: string;    
  admin_comment?: string; // Kommentar vom Admin (Backend: comment/artist_comment)
}

const statusDisplay: Record<string, string> = {
  angefragt: 'Aktion nötig',
  angeboten: 'Angeboten',
  akzeptiert: 'Akzeptiert',
  abgelehnt: 'Abgelehnt',
  storniert: 'Storniert',
};

const statusBadgeClass = (stRaw: string) => {
  const st = String(stRaw).toLowerCase();
  if (st === 'abgelehnt' || st === 'storniert') return 'bg-red-900/20 text-red-300 border border-red-700';
  if (st === 'akzeptiert') return 'bg-green-900/20 text-green-300 border border-green-700';
  return 'bg-amber-900/20 text-amber-300 border border-amber-700';
};

const MeineAnfragen: React.FC = () => {
  const { token } = useAuth();
  if (!token) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-red-600">
        Kein Auth-Token gefunden. Bitte neu einloggen oder Seite neu laden.
      </div>
    );
  }
  const [anfragen, setAnfragen] = useState<Anfrage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'aktion' | 'alle'>('aktion');
  const [offerInputs, setOfferInputs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | number | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  const apiFetch = async (path: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { ...headers, ...(options.headers as any) },
      ...options,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return res.json();
  };

  useEffect(() => {
    const load = async () => {
      console.log('Lade Anfragen, Token:', token);
      setLoading(true);
      setError(null);
      try {
        const url = '/api/requests/requests';
        console.log('Fetch URL:', import.meta.env.VITE_API_URL + url);
        const data = await apiFetch(url);
        console.log('Rohdaten von /api/requests/requests:', data);
        // Erwartet ein Array direkt oder in { requests: [...] }
        const rawList: any[] = Array.isArray(data) ? data : data.requests || [];
        const list: Anfrage[] = rawList.map((item: any) => ({
          ...item,
          admin_comment: item.comment ?? item.artist_comment ?? undefined,
        }));
        setAnfragen(list);
        console.log('🕵️‍♀️ Loaded requests with all fields:', list);
        console.log('🧐 Loaded statuses:', list.map(a => a.status));
      } catch (e: any) {
        console.error('Fehler beim Laden:', e);
        setError(e.message || 'Fehler beim Laden der Anfragen');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const filtered = anfragen.filter(a => {
    const st = String(a.status).toLowerCase();
    console.log(`🧐 Filtering id=${a.id}, raw='${a.status}', norm='${st}', tab='${activeTab}'`);
    if (activeTab === 'aktion') {
      // Zeige nur angefragte (noch nicht beantwortete) Anfragen
      return st === 'angefragt';
    }
    // Bei 'alle' Tab wirklich alle anzeigen
    if (activeTab === 'alle') {
      return true;
    }
    return false;  // falls später weitere Tabs hinzukommen
  });

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return d;
    }
  };

  const formatTime = (t: string) => {
    // expects HH:MM:SS
    return t.slice(0,5);
  };

  // Extract the city part from an address (last segment after comma)
  const getCity = (address: string) => {
    const parts = address.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : address;
  };

  const handleOfferChange = (id: string | number, value: string) => {
    setOfferInputs(prev => ({ ...prev, [id]: value }));
  };

  const sendOffer = async (anfrage: Anfrage) => {
    const id = anfrage.id;
    const preisStr = offerInputs[id as any] || String(anfrage.recommended_price_min);
    const preisNum = Number(preisStr.replace(',', '.'));
    if (isNaN(preisNum) || preisNum <= 0) {
      alert('Bitte gültigen Preis eingeben.');
      return;
    }
    setSubmitting(id);
    // Optimistische Aktualisierung von Status und Gage
    setAnfragen(prev => prev.map(a => a.id === id ? { ...a, status: 'angeboten', artist_gage: preisNum } : a));
    try {
      // Debug log for payload
      console.log('🛰️ Sende Artist-Angebot PUT payload:', { price_offered: preisNum });
      const result = await apiFetch(`/api/requests/requests/${id}/offer`, {
        method: 'PUT',
        body: JSON.stringify({ price_offered: preisNum }),
      });
      // Aktualisiere mit den vom Server gelieferten Werten
      setAnfragen(prev => prev.map(a => a.id === id ? { ...a, status: result.status, artist_gage: result.price_offered } : a));
      alert('Angebot erfolgreich an den Admin weitergegeben.');
    } catch (e: any) {
      console.error(e);
      alert('Fehler beim Absenden des Angebots: ' + (e.message || '')); 
      // rollback
      setAnfragen(prev => prev.map(a => a.id === id ? { ...a, status: 'angefragt' } : a));
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-300">Meine Anfragen</h1>
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded border transition-colors ${
            activeTab === 'aktion'
              ? 'bg-white text-black border-white'
              : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('aktion')}
        >
          Aktion nötig
        </button>
        <button
          className={`px-4 py-2 rounded border transition-colors ${
            activeTab === 'alle'
              ? 'bg-white text-black border-white'
              : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('alle')}
        >
          Alle Anfragen
        </button>
      </div>

      {loading && <div className="text-gray-300">lade Anfragen…</div>}
      {error && <div className="text-red-400 mb-4">{error}</div>}


      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-400">Keine Anfragen in dieser Ansicht.</div>
      )}

      <div className="space-y-6">
        {filtered.map(anfrage => (
          <>
            {console.log('🕵️‍♀️ Rendering Anfrage object:', anfrage)}
            <div key={anfrage.id} className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="font-bold text-lg mb-7 text-white">
                  {anfrage.event_type} - {getCity(anfrage.event_address)} - {anfrage.show_type}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <HiCalendar className="w-4 h-4" />
                  <span>{formatDate(anfrage.event_date)} {formatTime(anfrage.event_time)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <HiLocationMarker className="w-4 h-4" />
                  <span>{anfrage.event_address}</span>
                </div>
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-300">
                  <HiCurrencyEuro className="w-4 h-4" />
                  <span className="font-black">Empfohlene Gage: {anfrage.recommended_price_min.toLocaleString('de-DE')}€ – {anfrage.recommended_price_max.toLocaleString('de-DE')}€</span>
                </div>
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-300 font-medium">
                  <HiClock className="w-4 h-4" />
                  <span>Dauer der Show: {anfrage.duration_minutes} Minuten</span>
                </div>
                {anfrage.special_requests && (
                  <div className="mt-2 text-sm text-gray-300">
                    Besondere Wünsche: {anfrage.special_requests}
                  </div>
                )}
              </div>
              <div className="flex-none flex flex-col items-start gap-2">
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusBadgeClass(anfrage.status as string)}`}>
                    {statusDisplay[String(anfrage.status).toLowerCase()] || String(anfrage.status)}
                  </span>
                </div>
                {activeTab === 'alle' ? (
                  <div className="space-y-1 text-sm">
                    {anfrage.artist_gage != null ? (
                      <div>Dein Angebot: {anfrage.artist_gage.toLocaleString('de-DE')}€</div>
                    ) : (
                      <div className="italic text-gray-400">Keine Gage abgegeben.</div>
                    )}
                    {anfrage.artist_offer_date && (
                      <div>Gesendet am: {formatDate(anfrage.artist_offer_date)}{' '}{formatTime(anfrage.artist_offer_date)}</div>
                    )}
                    {anfrage.admin_comment && (
                      <div className="mt-2 p-2 rounded border border-amber-700 bg-amber-900/20 text-amber-300 text-sm">
                        <span className="font-semibold">Kommentar:&nbsp;</span>
                        {anfrage.admin_comment}
                      </div>
                    )}
                  </div>
                ) : String(anfrage.status).toLowerCase() === 'angefragt' ? (
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm font-medium">Dein Angebot (in €)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={offerInputs[anfrage.id as any] ?? String(anfrage.recommended_price_min)}
                        onChange={e => handleOfferChange(anfrage.id, e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400 rounded px-3 py-2"
                      />
                      <button
                        disabled={submitting === anfrage.id}
                        onClick={() => sendOffer(anfrage)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-700 disabled:opacity-50"
                      >
                        {submitting === anfrage.id ? 'Sende…' : 'Angebot senden'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-sm">
                    <div className="italic text-gray-400">Kein weiteres Handeln nötig.</div>
                    {anfrage.artist_gage != null && (
                      <div>Dein Angebot: {anfrage.artist_gage.toLocaleString('de-DE')}€</div>
                    )}
                    {anfrage.artist_offer_date && (
                      <div>Gesendet am: {formatDate(anfrage.artist_offer_date)}{' '}{formatTime(anfrage.artist_offer_date)}</div>
                    )}
                    {anfrage.admin_comment && (
                      <div className="mt-2 p-2 rounded border border-amber-700 bg-amber-900/20 text-amber-300 text-sm">
                        <span className="font-semibold">Kommentar:&nbsp;</span>
                        {anfrage.admin_comment}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default MeineAnfragen;