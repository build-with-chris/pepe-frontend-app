import React, { useEffect, useState } from 'react';
import { CarouselOrientation } from "@/components/carousel-Künstler";
import ArtistCard from "@/components/ArtistCard/ArtistCard";
import { Hero228 } from '@/components/hero228';
import { Hero87 } from '@/components/hero87';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


interface Artist {
  id: number;
  name: string;
  profile_image_url?: string | null;
  bio?: string | null;
  disciplines?: string[] | null;
  gallery?: string[] | null;
  gallery_urls?: string[] | null;
  instagram?: string | null;
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
          // Galerie-Felder aus dem Backend
          gallery: Array.isArray(a.gallery) ? a.gallery : null,
          gallery_urls: Array.isArray(a.gallery_urls) ? a.gallery_urls : [],
          // Social
          instagram: a.instagram ?? null,
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
          <Hero228 />
          
        </div>
        <div className="container mx-auto p-6 text-white">
        <Hero87 />
        <div className="relative flex flex-col items-center text-center text-white my-8">
          <div className="pointer-events-none absolute -top-10">
            <DotLottieReact
              src="https://lottie.host/e86a7557-375e-4cf6-abc0-c8f0d034b637/mQay5cJDVU.lottie"
              loop
              autoplay
              style={{ width: 96, height: 96, filter: "brightness(2)" }}
            />
          </div>
          <div className="text-xl md:text-3xl italic">
            "Wo Kunst zu Magie wird"
          </div>
        </div>

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