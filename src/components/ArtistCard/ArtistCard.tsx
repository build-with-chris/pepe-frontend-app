

import React from "react";
import ArtistCardFront from "./ArtistCardFront";
import ArtistCardBack from "./ArtistCardBack";

export interface Artist {
  id: number;
  name: string;
  profile_image_url?: string | null;
  bio?: string | null;
  disciplines?: string[] | null;
  gallery?: string[] | null;
  quote?: string | null;
}

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const [flipped, setFlipped] = React.useState(false);

  const handleFlip = () => setFlipped((f) => !f);
  const flipToFront = () => setFlipped(false);
  const flipToBack = () => setFlipped(true);

  return (
    <div
      className="relative aspect-[3/4] min-h-[340px] [perspective:1000px] cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
      onClick={handleFlip}
    >
      <div
        className={`absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <ArtistCardFront artist={artist} onFlip={flipToBack} />
        <ArtistCardBack artist={artist} onFlip={flipToFront} />
      </div>
    </div>
  );
};

export default ArtistCard;