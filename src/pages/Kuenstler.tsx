import React, { useEffect, useState } from 'react';
import { CarouselOrientation } from "@/components/carousel-Landingpage";

interface Artist {
  id: number;
  name: string;
  profile_image_url?: string | null;
  bio?: string | null;
}

export default function Kuenstler(){
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/api/artists`;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const rawList: any[] = Array.isArray(data) ? data : (data?.artists ?? []);
        const mapped: Artist[] = rawList.map(a => ({
          id: a.id,
          name: a.name,
          profile_image_url: a.profile_image_url ?? a.image_url ?? null,
          bio: a.bio ?? null,
        }));
        setArtists(mapped);
      } catch (e: any) {
        console.error('Künstler-Laden fehlgeschlagen:', e);
        setError(e?.message || 'Fehler beim Laden');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

    return (
      <div>

        <div className="relative h-[400px] md:h-[600px] lg:h-[800px] overflow-hidden flex items-start justify-center">
          <CarouselOrientation />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center">
              Wir machen ihr Event<br />unvergesslich
            </h2>
          </div>
        </div>
        <div className="container mx-auto p-6 text-white">
          <section className="intro mb-12 space-y-4">
            <h1 className="text-4xl font-bold">Unsere Künstler</h1>
            <p>
              Unsere Künstler stammen aus renommierten Zirkusschulen in ganz Europa und jede:r präsentiert
              seine einzigartige Art, sich auf der Bühne zu zeigen.
            </p>
            <p>
              Unser Netzwerk erstreckt sich jedoch über die ganze Welt.
            </p>
            <p>
              Als Pepe Collective trainieren wir regelmäßig gemeinsam in München und sorgen für
              nahtlose Übergänge in unseren Darbietungen.
            </p>
            <p>
              Wenn du dir nicht sicher bist, ob unsere Künstler zu deinem Event passen, dann
              besuche uns einfach und lerne deinen Favoriten persönlich kennen.
            </p>
          </section>

          <section className="artist-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <div className="col-span-full text-gray-300">Lade Künstler…</div>
            )}
            {error && (
              <div className="col-span-full text-red-400">{error}</div>
            )}
            {!loading && !error && artists.length === 0 && (
              <div className="col-span-full text-gray-300">Noch keine Künstler verfügbar.</div>
            )}
            {!loading && !error && artists.map(artist => (
              <div key={artist.id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
                <div className="relative w-full aspect-square bg-gray-800">
                  {artist.profile_image_url ? (
                    <img
                      src={artist.profile_image_url}
                      alt={artist.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Kein Bild
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-white">{artist.name}</h2>
                  <p className="text-sm text-gray-300 whitespace-pre-line line-clamp-4">
                    {artist.bio?.trim() || 'Keine Bio hinterlegt.'}
                  </p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    );
}