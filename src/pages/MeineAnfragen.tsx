import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

type Status = 'requested' | 'angefragt' | 'angeboten' | 'akzeptiert' | 'abgelehnt' | 'storniert';

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
}

const statusDisplay: Record<string, string> = {
  requested: 'Aktion nötig',
  angefragt: 'Angefragt',
  angeboten: 'Angeboten',
  akzeptiert: 'Akzeptiert',
  abgelehnt: 'Abgelehnt',
  storniert: 'Storniert',
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
        const list: Anfrage[] = Array.isArray(data) ? data : data.requests || [];
        setAnfragen(list);
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
    if (activeTab === 'aktion') {
      return String(a.status).toLowerCase() === 'requested';
    }
    return true;
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
    // optimistisch: status auf angeboten setzen
    setAnfragen(prev => prev.map(a => (a.id === id ? { ...a, status: 'angeboten' } as any : a)));
    try {
      await apiFetch(`/api/requests/${id}/offer`, {
        method: 'PUT',
        body: JSON.stringify({ artist_gage: preisNum }),
      });
      alert('Angebot erfolgreich an den Admin weitergegeben.');
    } catch (e: any) {
      console.error(e);
      alert('Fehler beim Absenden des Angebots: ' + (e.message || '')); 
      // rollback
      setAnfragen(prev => prev.map(a => (a.id === id ? { ...a, status: 'requested' } as any : a)));
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Meine Anfragen</h1>
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'aktion' ? 'bg-black text-white' : 'border'}`}
          onClick={() => setActiveTab('aktion')}
        >
          Aktion nötig
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'alle' ? 'bg-black text-white' : 'border'}`}
          onClick={() => setActiveTab('alle')}
        >
          Alle Anfragen
        </button>
      </div>

      {loading && <div>lade Anfragen…</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="mb-4 text-xs bg-gray-100 p-3 rounded">
        <div className="font-mono break-words">Debug raw data: {JSON.stringify(anfragen.slice(0,5), null, 2)}</div>
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-600">Keine Anfragen in dieser Ansicht.</div>
      )}

      <div className="space-y-6">
        {filtered.map(anfrage => (
          <div key={anfrage.id} className="border rounded-lg p-5 shadow-sm">
            <div className="flex justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="font-bold text-lg">{anfrage.event_type} – {anfrage.show_type}</div>
                <div className="text-sm text-gray-600">
                  {formatDate(anfrage.event_date)} {formatTime(anfrage.event_time)} · {anfrage.event_address}
                </div>
                <div className="mt-1 text-sm">
                  Empfohlene Gage: {anfrage.recommended_price_min.toLocaleString('de-DE')}€ – {anfrage.recommended_price_max.toLocaleString('de-DE')}€
                </div>
              </div>
              <div className="flex-none flex flex-col items-start gap-2">
                <div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    {statusDisplay[String(anfrage.status).toLowerCase()] || String(anfrage.status)}
                  </span>
                </div>
                {String(anfrage.status).toLowerCase() === 'requested' && (
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm font-medium">Dein Angebot (in €)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={offerInputs[anfrage.id as any] ?? String(anfrage.recommended_price_min)}
                        onChange={e => handleOfferChange(anfrage.id, e.target.value)}
                        className="border px-3 py-2 rounded flex-1"
                      />
                      <button
                        disabled={submitting === anfrage.id}
                        onClick={() => sendOffer(anfrage)}
                        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                      >
                        {submitting === anfrage.id ? 'Sende…' : 'Angebot senden'}
                      </button>
                    </div>
                  </div>
                )}
                {String(anfrage.status).toLowerCase() !== 'requested' && (
                  <div className="text-sm italic text-gray-500">Kein weiteres Handeln nötig.</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeineAnfragen;