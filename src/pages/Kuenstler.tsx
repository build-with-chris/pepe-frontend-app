import React, { useEffect, useState } from 'react';
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
  const DISCIPLINES = [
    "Zauberer",
    "Cyr-Wheel",
    "Bodenakrobatik",
    "Luftakrobatik",
    "Partnerakrobatik",
    "Chinese Pole",
    "Hula Hoop",
    "Handstand",
    "Contemporary Dance",
    "Breakdance",
    "Teeterboard",
    "Jonglage",
    "Moderation",
    "Pantomime/Entertainment",
  ] as const;

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (d: string) => {
    setActiveFilters(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  };
  const clearFilters = () => setActiveFilters([]);

  const filteredArtists = React.useMemo(() => {
    if (!activeFilters.length) return artists;
    const set = new Set(activeFilters.map(s => s.toLowerCase()));
    return artists.filter(a => {
      const discs = (a.disciplines || []).map(x => (x || "").toLowerCase());
      // match if any artist discipline contains any selected filter (substring allows variants)
      return discs.some(d => Array.from(set).some(sel => d.includes(sel)));
    });
  }, [artists, activeFilters]);



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
      <div className="pt-20 md:pt-24 lg:pt-28">

        <div className="relative h-[560px] md:h-[640px] lg:h-[800px] overflow-hidden flex items-center justify-center mb-8">
          <Hero228 />
          
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-white relative z-10">
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

          {/* Filterleiste nach Disziplin */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={clearFilters}
                className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                  activeFilters.length === 0
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/30 hover:bg-white/10"
                }`}
              >
                Alle
              </button>
              <div className="flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {DISCIPLINES.map((d) => {
                    const active = activeFilters.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleFilter(d)}
                        className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition-colors ${
                          active
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-white border-white/30 hover:bg-white/10"
                        }`}
                        aria-pressed={active}
                      >
                        <span className="block sm:hidden">
                          {d === "Pantomime/Entertainment"
                            ? "Pantomime"
                            : d === "Contemporary Dance"
                              ? "Contemporary"
                              : d}
                        </span>
                        <span className="hidden sm:block">{d}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <span className="text-sm text-white/70 whitespace-nowrap">
                {filteredArtists.length} Ergebnis{filteredArtists.length === 1 ? "" : "se"}
              </span>
            </div>
          </div>

          <section className="artist-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <div className="col-span-full text-gray-300">Lade Künstler…</div>
            )}
            {error && (
              <div className="col-span-full text-red-400">{error}</div>
            )}
            {!loading && !error && filteredArtists.length === 0 && (
              <div className="col-span-full text-gray-300">Noch keine Künstler verfügbar.</div>
            )}
            {!loading && !error && filteredArtists.map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </section>
          </div>
          </div>
    );
  }