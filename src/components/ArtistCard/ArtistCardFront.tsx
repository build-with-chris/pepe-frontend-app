import React from "react";

export interface Artist {
  id: number;
  name: string;
  profile_image_url?: string | null;
  bio?: string | null;
  disciplines?: string[] | null;
}

interface ArtistCardFrontProps {
  artist: Artist;
  onFlip: () => void; // wird vom Wrapper übergeben
}

const ArtistCardFront: React.FC<ArtistCardFrontProps> = ({ artist, onFlip }) => {
  const quote =
    (artist.bio?.split(".")[0] || "").trim(); // erster Satz als kurzes Zitat

  // Rest der Bio ohne den ersten Satz
  const remainingBio = React.useMemo(() => {
    const full = artist.bio?.trim() || "";
    if (!full) return "";
    const firstDot = full.indexOf(".");
    if (firstDot === -1) return "";
    return full.slice(firstDot + 1).trim();
  }, [artist.bio]);

  return (
    <div className="absolute inset-0 bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800 [backface-visibility:hidden]">
      {/* Bild */}
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

      {/* Inhalt */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-white">{artist.name}</h2>

        {quote && (
          <p className="italic text-gray-400 mb-2">„{quote}.“</p>
        )}

        {/* Disziplinen als Badges */}
        {artist.disciplines && artist.disciplines.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {artist.disciplines.map((d, idx) => (
              <span
                key={`${d}-${idx}`}
                className="bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded"
              >
                {d}
              </span>
            ))}
          </div>
        )}

        {/* Kurztext (gekürzt) */}
        {remainingBio && (
          <p className="text-sm text-gray-300 whitespace-pre-line line-clamp-4">
            {remainingBio}
          </p>
        )}

        {/* Karte drehen */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFlip();
          }}
          className="mt-3 inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline"
          aria-label="Karte drehen"
        >
          Karte drehen
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 12a10 10 0 1 0 10-10" />
            <path d="M2 2v6h6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ArtistCardFront;