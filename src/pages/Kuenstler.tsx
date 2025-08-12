import React, { useEffect, useState } from 'react';
import { CarouselOrientation } from "@/components/carousel-Landingpage";
import ArtistCard from "@/components/ArtistCard/ArtistCard";

interface Artist {
  id: number;
  name: string;
  profile_image_url?: string | null;
  bio?: string | null;
  disciplines?: string[] | null;
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
          disciplines: a.disciplines ?? null,
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
            <h2 className="font-bold text-white text-center">
              <span className="block text-3xl sm:hidden mt-24">Event-Magie</span>
              <span className="hidden sm:block text-4xl md:text-6xl">Wir machen Ihr Event<br />unvergesslich</span>
            </h2>
          </div>
        </div>
        <div className="container mx-auto p-6 text-white">
          <section className="intro mb-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Unsere Künstler</h1>
            <div className="space-y-2 text-base md:text-lg text-gray-200 leading-relaxed">
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
            </div>
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
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </section>
          </div>
          </div>
    );
  }