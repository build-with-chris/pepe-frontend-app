import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Artist {
  id: number;
  name: string;
  profile_image_url?: string | null;
  bio?: string | null;
}

export default function KuenstlerVerwaltung() {
  const { token } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [slots, setSlots] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/artists`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        // Expecting data.artists or an array directly
        const rawList: any[] = data.artists ?? data ?? [];
        const list: Artist[] = rawList.map(a => ({
          id: a.id,
          name: a.name,
          // prefer backend field; fallback to legacy image_url if present
          profile_image_url: a.profile_image_url ?? a.image_url ?? null,
          bio: a.bio ?? null,
        }));
        setArtists(list);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!token) return;
    console.log('📡 token in slots useEffect:', token);
    fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        console.log('🚀 Slots fetched:', data.slots);
        setSlots(data.slots || []);
      })
      .catch(err => {
        console.error('Fehler beim Laden der Slots:', err);
      });
  }, [token]);

  const toggle = (id: number) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (loading) return <p className="p-6 text-white">Lade Künstler...</p>;
  if (error) return <p className="p-6 text-red-500">Fehler: {error}</p>;

  return (
    <div className="w-screen bg-black min-h-screen text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Künstlerverwaltung (Admin)</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map(artist => (
            <div
              key={artist.id}
              className="bg-gray-800 rounded shadow-lg cursor-pointer overflow-hidden"
              onClick={() => toggle(artist.id)}
            >
              {artist.profile_image_url ? (
                <img
                  src={artist.profile_image_url}
                  alt={artist.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-400">
                  Kein Bild
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{artist.name}</h2>
                <p className="text-sm text-gray-300 whitespace-pre-line mb-2">
                  {artist.bio?.trim() || 'Keine Bio hinterlegt.'}
                </p>
                {expanded.includes(artist.id) && (
                  <ul className="text-sm space-y-1">
                    {(() => {
                      // Filter slots for this artist by checking artist_id or nested artist.id
                      const artistSlots = slots.filter(slot => {
                        if (slot.artist_id === artist.id) return true;
                        if (slot.artist && slot.artist.id === artist.id) return true;
                        return false;
                      });
                      console.log('Slots for artist', artist.id, artistSlots);
                      return (
                        artistSlots.map(slot => (
                          <li key={slot.id ?? slot.date}>{new Date(slot.date).toLocaleDateString()}</li>
                        ))
                      );
                    })()}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
