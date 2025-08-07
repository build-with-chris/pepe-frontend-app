import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OfferEditPage() {
  const { reqId, offerId } = useParams<{ reqId: string; offerId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [gage, setGage] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [recMin, setRecMin] = useState<number>(0);
  const [recMax, setRecMax] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [requestData, setRequestData] = useState<any>(null);
  const [adminOffers, setAdminOffers] = useState<any[]>([]);
  const [artistOfferData, setArtistOfferData] = useState<any>(null);
  const [artistNames, setArtistNames] = useState<string[]>([]);

  const allowedStatuses = ['angefragt','angeboten','akzeptiert','abgelehnt','storniert'] as const;

  async function handleStatusChange(offerId: number, newStatus: string) {
    console.log('🔧 handleStatusChange called for offerId, newStatus:', offerId, newStatus);
    try {
      console.log(`🚀 Sending PUT to /admin/admin_offers/${offerId}`);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/admin_offers/${offerId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setAdminOffers(prev =>
        prev.map(o => (o.id === offerId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Status update failed', err);
      alert('Status konnte nicht aktualisiert werden');
    }
  }

  useEffect(() => {
    if (!token || !reqId || !offerId) return;
    setLoading(true);
    // Fetch all requests (artist view) to get recommended customer price
    const reqsPromise = fetch(
      `${import.meta.env.VITE_API_URL}/api/requests/requests`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
    // Fetch all admin offers for this request to get override-price
    const offersPromise = fetch(
      `${import.meta.env.VITE_API_URL}/admin/requests/${reqId}/admin_offers`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
    // Also fetch the artist's own offer
    const artistOfferPromise = fetch(
      `${import.meta.env.VITE_API_URL}/api/requests/requests/${reqId}/offer`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
    Promise.all([reqsPromise, offersPromise, artistOfferPromise])
      .then(([reqList, offers, artistOffer]) => {
        // Find this request
        const reqData = reqList.find((r: any) => String(r.id) === reqId);
        if (!reqData) throw new Error('Request not found');
        // Set recommended customer price
        setRecMin(reqData.recommended_price_min);
        setRecMax(reqData.recommended_price_max);
        // Determine initial gage: artist's own offer, if any
        const ownGage = artistOffer?.artist_gage;
        // If no artist offer, fall back to admin override, then to recommendation
        const currentOffer = offers.find((o: any) => String(o.id) === offerId);
        setGage(
          ownGage != null
            ? ownGage
            : currentOffer?.override_price ?? reqData.recommended_price_min
        );
        setNotes(currentOffer?.notes ?? '');
        setRequestData(reqData);
        setAdminOffers(offers);
        setArtistOfferData(artistOffer);
        // Fetch artist names for display
        if (reqData.artist_ids?.length) {
          fetch(`${import.meta.env.VITE_API_URL}/api/artists`)
            .then(res => res.json())
            .then((allArtists: any[]) => {
              const names = allArtists
                .filter(a => reqData.artist_ids.includes(a.id))
                .map(a => a.name);
              setArtistNames(names);
              // Debug log loaded data
              console.log('🔍 OfferEditPage loaded:', {
                requestData: reqData,
                adminOffers: offers,
                artistOfferData: artistOffer,
                artistNames: names,
                recMin,
                recMax,
                gage,
                notes
              });
            })
            .catch(err => console.error('Fehler beim Laden der Künstlernamen:', err));
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token, reqId, offerId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/admin_offers/${offerId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ override_price: gage, notes }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      navigate(-1);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (loading) return <p className="p-6 text-white">Lade Daten...</p>;
  if (error) {
    console.error('🚨 OfferEditPage error:', error);
    return <p className="p-6 text-red-500">Fehler: {error}</p>;
  }
  // Debug log before render
  console.log('🔄 Rendering OfferEditPage with state:', {
    requestData,
    adminOffers,
    artistOfferData,
    artistNames,
    gage,
    notes
  });

  return (
    <div className="w-screen bg-black min-h-screen text-white">
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">Angebot bearbeiten</h1>
        <div className="flex flex-col gap-6">
          {/* Left: Event Details */}
          <div className="bg-gray-800 p-4 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <h2 className="text-xl font-semibold mb-4 col-span-full">Event-Details</h2>
            <p><strong>Angefragte Künstler:</strong> {artistNames.join(', ')}</p>
            <p><strong>Angefragte Disziplinen:</strong> {requestData.show_discipline}</p>
            <p><strong>Name Veranstalter:</strong> {requestData.client_name}</p>
            <p><strong>Dauer der Show:</strong> {requestData.duration_minutes} Minuten</p>
            <p><strong>Adresse:</strong> {requestData.event_address}</p>
            <p><strong>Datum:</strong> {requestData.event_date}</p>
            <p><strong>Uhrzeit:</strong> {requestData.event_time}</p>
            <p><strong>Event-Typ:</strong> {requestData.event_type}</p>
            <p><strong>Indoor:</strong> {requestData.is_indoor ? 'Ja' : 'Nein'}</p>
            <p><strong>Beleuchtung:</strong> {requestData.needs_light ? 'Ja' : 'Nein'}</p>
            <p><strong>Ton:</strong> {requestData.needs_sound ? 'Ja' : 'Nein'}</p>
            <p><strong>Gäste:</strong> {requestData.number_of_guests}</p>
            <p><strong>Empf. Preis Max:</strong> {recMax.toLocaleString('de-DE')}€</p>
            <p><strong>Disziplin:</strong> {requestData.show_discipline}</p>
            <p><strong>Show-Typ:</strong> {requestData.show_type}</p>
            <p><strong>Besondere Wünsche:</strong> {requestData.special_requests || '–'}</p>
            <p><strong>Team-Größe:</strong> {requestData.team_size}</p>
          </div>
          {/* Right: Artist Offers */}
          <div className="grid grid-cols-1 gap-4">
            <h2 className="text-xl font-semibold mb-2">Artist-Angebote</h2>
            {requestData.artist_ids.map((artistId, idx) => {
              console.log('🔁 Rendering artist card idx:', idx, 'artistId:', artistId, 'adminOffer:', adminOffers[idx]);
              return (
              <div key={artistId} className="bg-gray-800 p-4 rounded shadow">
                <p><strong>Künstler:</strong> {artistNames[idx] ?? artistId}</p>
                {artistOfferData?.artist_gage != null ? (
                  <p><strong>Gesendete Gage:</strong> {artistOfferData.artist_gage.toLocaleString('de-DE')}€</p>
                ) : (
                  <p className="italic">noch keine Gage gesendet</p>
                )}
                <label className="block mt-2 font-medium">Status</label>
                <select
                  className="mt-1 w-full bg-gray-700 text-white p-2 rounded"
                  value={adminOffers[idx]?.status ?? requestData.status}
                  onChange={e => handleStatusChange(adminOffers[idx]?.id, e.target.value)}
                >
                  {allowedStatuses.map(s => (
                    <option key={s} value={s} className="text-black">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}