import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import GuidelinesModal from "@/components/GuidelinesModal";
import GalleryUploader from "@/components/GalleryUploader";
import { uploadProfileImage, uploadGalleryImages } from "@/lib/storage/upload";
import { useNavigate } from "react-router-dom";

const PROFILE_BUCKET = import.meta.env.VITE_SUPABASE_PROFILE_BUCKET || "profiles";

const disciplinesOptions = [
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
];

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number>(700);
  const [priceMax, setPriceMax] = useState<number>(900);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendArtistId, setBackendArtistId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [backendDebug, setBackendDebug] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bio, setBio] = useState<string>("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || !token) return;
      const baseUrl = import.meta.env.VITE_API_URL;
      try {
        const res = await fetch(`${baseUrl}/api/artists/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const me = await res.json();
        setName(me.name || "");
        setAddress(me.address || "");
        setPhoneNumber(me.phone_number || "");
        setDisciplines(me.disciplines || []);
        setPriceMin(me.price_min ?? 700);
        setPriceMax(me.price_max ?? 900);
        setBio(me.bio || "");
        setProfileImageUrl(me.profile_image_url || null);
        setGalleryUrls(Array.isArray(me.gallery_urls) ? me.gallery_urls : []);
        if (me.id) {
          setBackendArtistId(String(me.id));
          setLocked(true);
        }
      } catch (err) {
        setBackendDebug(`Load backend profile failed: ${err}`);
      }
    };
    loadProfile();
  }, [user, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !address || !phoneNumber || disciplines.length === 0) {
      setError("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    if (priceMin > priceMax) {
      setError("Das Minimum darf nicht größer als das Maximum sein.");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      if (!user?.email) throw new Error("User email fehlt");

      let effectiveId = backendArtistId || "new-id";
      let imageUrl = await uploadProfileImage(
        profileImageFile,
        effectiveId,
        PROFILE_BUCKET,
        supabase,
        setProfileImageUrl,
        setBackendDebug,
        profileImageUrl
      );

      let mergedGalleryUrls = await uploadGalleryImages(
        galleryFiles,
        effectiveId,
        PROFILE_BUCKET,
        supabase,
        galleryUrls,
        setGalleryUrls
      );

      const payload: any = { bio: bio.toString(), gallery_urls: mergedGalleryUrls };
      if (imageUrl) payload.profile_image_url = imageUrl;

      await fetch(`${baseUrl}/api/artists/me/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setSuccess(true);
      setLocked(true);
    } catch (err: any) {
      setError("Profil speichern fehlgeschlagen.");
      setBackendDebug(prev => `Sync error: ${err?.message || err}${prev ? "\n" + prev : ""}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleDiscipline = (d: string) => {
    if (locked) return;
    setDisciplines(prev => (prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]));
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Profil einrichten</h1>
        {locked && (
          <button
            type="button"
            onClick={() => {
              setLocked(false);
              setSuccess(false);
            }}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Profil bearbeiten
          </button>
        )}
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && (
        <div className="mb-4 text-green-700 bg-green-100 border border-green-400 rounded p-3">
          Profil erfolgreich gespeichert!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name*</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={locked}
          />
        </div>
        {/* Adresse */}
        <div>
          <label className="block mb-1 font-medium">Adresse*</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={locked}
          />
        </div>
        {/* Telefonnummer */}
        <div>
          <label className="block mb-1 font-medium">Telefonnummer*</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={locked}
          />
        </div>
        {/* Disziplinen */}
        <div>
          <label className="block mb-1 font-medium">Disziplinen*</label>
          <div className="flex flex-wrap gap-2">
            {disciplinesOptions.map(d => (
              <button
                type="button"
                key={d}
                onClick={() => toggleDiscipline(d)}
                disabled={locked}
                className={`px-3 py-1 border rounded ${
                  disciplines.includes(d) ? "bg-blue-600 text-white" : "bg-white text-black"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        {/* Preis */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Preis (min)*</label>
            <input
              type="number"
              value={priceMin}
              onChange={e => setPriceMin(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded"
              min={0}
              required
              disabled={locked}
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Preis (max)*</label>
            <input
              type="number"
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded"
              min={priceMin}
              required
              disabled={locked}
            />
          </div>
        </div>
        {/* Profilbild */}
        <div>
          <label className="block mb-1 font-medium">Profilbild</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setProfileImageFile(e.target.files?.[0] ?? null)}
            disabled={locked}
            className="w-full"
          />
          {profileImageUrl && (
            <img src={profileImageUrl} alt="Profilbild" className="mt-2 h-24 rounded object-cover" />
          )}
        </div>
        {/* Galerie */}
        <GalleryUploader
          locked={locked}
          galleryUrls={galleryUrls}
          setGalleryUrls={setGalleryUrls}
          galleryFiles={galleryFiles}
          setGalleryFiles={setGalleryFiles}
        />
        {/* Über mich */}
        <div>
          <label className="block mb-1 font-medium">Über mich</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            disabled={locked}
            className="w-full border px-3 py-2 rounded h-24"
          />
        </div>
        {/* Submit */}
        <button
          type="submit"
          disabled={loading || locked}
          className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
        >
          {locked ? "Profil gesperrt" : loading ? "Speichern..." : "Profil speichern"}
        </button>
      </form>
      {backendDebug && (
        <div className="mt-4 p-3 bg-gray-100 border rounded text-xs whitespace-pre-wrap">
          <strong>Debug Log:</strong>
          <div>{backendDebug}</div>
        </div>
      )}
      <GuidelinesModal />
    </div>
  );
}