import * as React from "react";

interface GalleryUploaderProps {
  locked?: boolean;
  galleryUrls: string[];
  setGalleryUrls: React.Dispatch<React.SetStateAction<string[]>>; // aktuell nicht zwingend genutzt, aber praktisch für später (z. B. Remove)
  galleryFiles: File[];
  setGalleryFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function GalleryUploader({
  locked,
  galleryUrls,
  setGalleryUrls,
  galleryFiles,
  setGalleryFiles,
}: GalleryUploaderProps) {
  // Cleanup für ObjectURLs der Previews
  React.useEffect(() => {
    const urls = galleryFiles.map((f) => URL.createObjectURL(f));
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [galleryFiles]);

  return (
    <div>
      <label className="block mb-1 font-medium">Weitere Fotos (max. 3)</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (!e.target.files) return;
          const remaining = Math.max(0, 3 - galleryUrls.length);
          const files = Array.from(e.target.files).slice(0, remaining);
          setGalleryFiles(files);
        }}
        disabled={locked}
        className="w-full"
      />

      {/* Bereits gespeicherte Galerie-Bilder (vom Backend) */}
      {galleryUrls.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {galleryUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Galerie ${i + 1}`}
              className="h-24 w-full object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* Neue, noch nicht hochgeladene Bilder (lokale Vorschau) */}
      {galleryFiles.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {galleryFiles.map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              alt={`Neu ${i + 1}`}
              className="h-24 w-full object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
}