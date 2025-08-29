import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { disciplinesOptions } from "@/constraints/disciplines";
import GalleryUploader from "@/components/GalleryUploader";

export type ProfileFormProps = {
  profile: any;
  setProfile: (profile: any) => void;
  locked: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export function ProfileForm({ profile, setProfile, locked, onSubmit }: ProfileFormProps) {
  const { t } = useTranslation();
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const toggleDiscipline = (d: string) => {
    const current = Array.isArray(profile.disciplines) ? profile.disciplines : [];
    const next = current.includes(d)
      ? current.filter((x: string) => x !== d)
      : [...current, d];
    setProfile({ disciplines: next });
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Basisdaten */}
      <section className="md:col-span-2 rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-300">Basisdaten</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Name */}
          <div>
            <label className="mb-1 block font-medium text-gray-300">Name*</label>
            <input
              type="text"
              value={profile.name ?? ""}
              onChange={(e) => setProfile({ name: e.target.value })}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400"
              required
              disabled={locked}
            />
          </div>
          {/* Adresse */}
          <div>
            <label className="mb-1 block font-medium text-gray-300">Adresse*</label>
            <input
              type="text"
              value={profile.address ?? ""}
              onChange={(e) => setProfile({ address: e.target.value })}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400"
              required
              disabled={locked}
            />
          </div>
          {/* Telefonnummer */}
          <div>
            <label className="mb-1 block font-medium text-gray-300">Telefonnummer*</label>
            <input
              type="tel"
              value={profile.phoneNumber ?? ""}
              onChange={(e) => setProfile({ phoneNumber: e.target.value })}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400"
              required
              disabled={locked}
            />
          </div>
        </div>
      </section>

      {/* Disziplinen */}
      <section className="md:col-span-2 rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-300">Disziplinen</h2>
        <div className="flex flex-wrap gap-2">
          {disciplinesOptions.map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => toggleDiscipline(d)}
              disabled={locked}
              className={`rounded border px-3 py-1 ${Array.isArray(profile.disciplines) && profile.disciplines.includes(d)
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-gray-700 bg-gray-800 text-white hover:bg-gray-700"}`}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* Preisrahmen */}
      <section className="md:col-span-2 rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-300">Preisrahmen</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium text-gray-300">Preis (min)*</label>
            <input
              type="number"
              value={profile.priceMin ?? 0}
              onChange={(e) => setProfile({ priceMin: Number(e.target.value) })}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400"
              min={0}
              required
              disabled={locked}
            />
            <p className="mt-1 text-sm text-gray-400">
              Realistischer Richtwert für ein Teamevent (ca. 150 Personen, 5-Minuten-Act, ohne Anfahrtskosten). Nur Gage + ggf. Material.
            </p>
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-300">Preis (max)*</label>
            <input
              type="number"
              value={profile.priceMax ?? 0}
              onChange={(e) => setProfile({ priceMax: Number(e.target.value) })}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400"
              min={profile.priceMin ?? 0}
              required
              disabled={locked}
            />
            <p className="mt-1 text-sm text-gray-400">
              Oberer Rahmen für denselben Event-Case (150 Gäste, 5-Minuten-Act, ohne Anfahrt).
            </p>
          </div>
        </div>
      </section>

      {/* Profilbild (Preview) */}
      <section className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-300">Profilbild</h2>
        {profile.profileImageUrl ? (
          <img src={profile.profileImageUrl} alt="Profilbild" className="mt-2 h-24 rounded object-cover" />
        ) : (
          <p className="text-sm text-gray-400">Noch kein Profilbild hochgeladen</p>
        )}
        <p className="mt-3 text-xs text-gray-500">
          Upload/Änderung erfolgt im Haupt-Formular-Flow (Container). Diese Komponente zeigt die Vorschau.
        </p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
            setProfile({ profileImageFile: file });
            }
        }}
        disabled={locked}
        className="mt-3 block w-full text-sm text-gray-400 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-white hover:file:bg-blue-500 disabled:file:opacity-50"
        />
      </section>

      {/* Galerie */}
      <section className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm md:col-span-2">
        <h2 className="mb-4 text-lg font-semibold text-gray-300">Galerie</h2>
     <GalleryUploader
        galleryUrls={profile.galleryUrls || []}
        setGalleryUrls={(value) => {
          const next = typeof value === "function"
            ? (value as (prev: string[]) => string[])(profile.galleryUrls || [])
            : (value as string[]);
          setProfile({ galleryUrls: next });
        }}
        galleryFiles={profile.galleryFiles || []}
        setGalleryFiles={(files) => setProfile({ galleryFiles: files })}
        disabled={locked}
        max={9}
      />
      </section>

      {/* Über mich */}
      <section className="md:col-span-2 rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-gray-300">Über mich</h2>
        <p className="mb-2 text-sm text-gray-400">Dieser Text erscheint auf der Homepage unter deiner Karte. Sei kreativ, aber halte dich kurz.</p>
        <textarea
          value={profile.bio ?? ""}
          onChange={(e) => setProfile({ bio: e.target.value })}
          disabled={locked}
          className="h-28 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400"
        />
      </section>

      {/* Submit */}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={locked}
          className="w-full rounded-lg bg-gray-800 py-3 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          Speichern
        </button>
      </div>
    </form>
  );
}