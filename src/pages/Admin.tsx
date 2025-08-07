import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('dateAsc');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        console.log('🚀 Raw dashboard data:', data);
        // Entferne Artist-Verfügbarkeiten und Slots, bevor wir die Daten setzen
        const { availabilities, artistAvailability, slots, ...filtered } = data;
        setDashboardData(filtered);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const sortedOffers = useMemo(() => {
    if (!dashboardData?.offers) return [];
    const list = [...dashboardData.offers];
    switch (sortOption) {
      case 'dateAsc':
        return list.sort((a, b) => new Date(a.event_date + 'T' + a.event_time).getTime() - new Date(b.event_date + 'T' + b.event_time).getTime());
      case 'dateDesc':
        return list.sort((a, b) => new Date(b.event_date + 'T' + b.event_time).getTime() - new Date(a.event_date + 'T' + a.event_time).getTime());
      case 'statusAsc':
        return list.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
      case 'statusDesc':
        return list.sort((a, b) => (b.status || '').localeCompare(a.status || ''));
      default:
        return list;
    }
  }, [dashboardData?.offers, sortOption]);

  return (
    <div className="w-screen bg-black min-h-screen text-white">
      <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin-Bereich</h1>
      <p>Willkommen im Admin-Panel! Hier kannst du Einstellungen verwalten.</p>
      {dashboardData?.offers && (
        <div className="mb-4">
          <label className="mr-2">
            Sortieren nach:
            <select
              className="ml-2 bg-gray-700 text-white rounded px-2 py-1"
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="dateAsc">Datum aufsteigend</option>
              <option value="dateDesc">Datum absteigend</option>
              <option value="statusAsc">Status A–Z</option>
              <option value="statusDesc">Status Z–A</option>
            </select>
          </label>
        </div>
      )}
      {loading && <p>Lade Dashboard-Daten...</p>}
      {error && <p className="text-red-500">Fehler: {error}</p>}
      {sortedOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {sortedOffers.map((offer: any) => (
            <div
              key={offer.id}
              className="cursor-pointer bg-gray-800 shadow rounded p-4"
              onClick={() => navigate(`/admin/requests/${offer.id}/offers/${offer.id}/edit`)}
            >
              <h2 className="text-lg font-semibold mb-2">Angebot #{offer.id}</h2>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Kunde:</span> {offer.client_name} ({offer.client_email})</p>
                <p><span className="font-medium">Datum:</span> {offer.event_date} {offer.event_time}</p>
                {offer.status && (<p><span className="font-medium">Status:</span> {offer.status}</p>)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>Keine Angebote gefunden.</p>
      )}
      </div>
    </div>
  );
}