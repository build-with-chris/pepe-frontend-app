import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export interface Artist {
  id: number;
  name: string;
  profile_image_url?: string | null;
  bio?: string | null;
  disciplines?: string[] | null;
  gallery?: string[] | null;
  quote?: string | null;
}

interface ArtistCardBackProps {
  artist: Artist;
  onFlip: () => void;
}

const ArtistCardBack: React.FC<ArtistCardBackProps> = ({ artist, onFlip }) => {
  const images = (artist.gallery ?? []).filter(Boolean);

  const quote =
    artist?.quote?.trim() ||
    (artist?.bio?.split(".")[0]?.trim()
      ? `„${artist.bio.split(".")[0]}.“`
      : "„Kunst ist der kürzeste Weg zum Staunen.“");

  return (
    <div className="absolute inset-0 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col">
      {/* Carousel */}
      <div className="relative w-full h-44 md:h-52 bg-gray-900">
        {images.length > 0 ? (
          <Carousel className="w-full h-full">
            <CarouselContent>
              {images.map((src, idx) => (
                <CarouselItem key={idx} className="flex items-center justify-center">
                  <img
                    src={src}
                    alt={`${artist.name} – Bild ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
          </Carousel>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Keine weiteren Bilder
          </div>
        )}
      </div>

      {/* Inhalt */}
      <div className="relative flex-1 p-4 flex flex-col">
        <blockquote className="text-gray-200 italic leading-relaxed">
          {quote}
        </blockquote>
        <div className="mt-2 h-px bg-white/10" />
        <div className="mt-3 text-sm text-gray-400">
          <span className="text-gray-300 font-medium">{artist.name}</span>
        </div>

        <div className="flex-1" />

        {/* Back button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFlip();
            }}
            className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 hover:underline"
          >
            Zur Vorderseite
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 12A10 10 0 1 1 12 2" />
              <path d="M22 2v6h-6" />
            </svg>
          </button>
        </div>

        {/* Instagram Link */}
        <a
          href={(artist as any).instagram || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 text-pink-400 hover:text-pink-300"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 1.5A4 4 0 0 0 3.5 7.5v9A4 4 0 0 0 7.5 20.5h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4h-9zm4.5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ArtistCardBack;