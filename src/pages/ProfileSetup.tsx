import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import GuidelinesModal from "@/components/GuidelinesModal";
import GalleryUploader from "@/components/GalleryUploader";
import { uploadProfileImage, uploadGalleryImages } from "@/lib/storage/upload";
import { useNavigate } from "react-router-dom";

const PROFILE_BUCKET = import.meta.env.VITE_SUPABASE_PROFILE_BUCKET || "profiles";
const baseUrl = import.meta.env.VITE_API_URL;

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
  const [approvalStatus, setApprovalStatus] = useState<'approved' | 'pending' | 'rejected' | 'unsubmitted'>('unsubmitted');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || !token) return;
      try {
        let res = await fetch(`${baseUrl}/api/artists/me`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 403 || res.status === 404) {
          await fetch(`${baseUrl}/api/artists/me/ensure`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          }).catch(() => {});
          res = await fetch(`${baseUrl}/api/artists/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
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
        setApprovalStatus((me.approval_status as any) ?? 'unsubmitted');
        setRejectionReason(me.rejection_reason ?? null);
        if (me.id) {
        setBackendArtistId(String(me.id));
        const st = (me.approval_status as string) || 'unsubmitted';
        setLocked(st === 'pending' || st === 'approved');   
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

    if (!backendArtistId) {
      const ensured = await fetch(`${baseUrl}/api/artists/me/ensure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    }).then(r => r.ok ? r.json() : null).catch(() => null);
    if (ensured?.id) setBackendArtistId(String(ensured.id));
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

      const nextStatus = approvalStatus === 'approved' ? 'approved' : 'pending';

      // ALLE Felder mitsenden!
      const payload: any = {
        name,
        address,
        phone_number: phoneNumber,
        price_min: priceMin,
        price_max: priceMax,
        disciplines,                    // array of strings
        bio: bio.toString(),
        gallery_urls: mergedGalleryUrls,
        approval_status: nextStatus,
      };
      if (imageUrl) payload.profile_image_url = imageUrl;

      // speichern + Rückgabe prüfen
      const saveRes = await fetch(`${baseUrl}/api/artists/me/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!saveRes.ok) {
        const t = await saveRes.text();
        throw new Error(`Save failed: ${saveRes.status} ${t}`);
      }

      const saved = await saveRes.json().catch(() => null);

      // UI aus Serverantwort aktualisieren (stellt sicher, dass wir sehen, was wirklich gespeichert wurde)
      if (saved) {
        setName(saved.name || "");
        setAddress(saved.address || "");
        setPhoneNumber(saved.phone_number || "");
        setDisciplines(Array.isArray(saved.disciplines) ? saved.disciplines : []);
        setPriceMin(saved.price_min ?? priceMin);
        setPriceMax(saved.price_max ?? priceMax);
        setBio(saved.bio || "");
        setProfileImageUrl(saved.profile_image_url || imageUrl || null);
        setGalleryUrls(Array.isArray(saved.gallery_urls) ? saved.gallery_urls : mergedGalleryUrls);
        setApprovalStatus((saved.approval_status as any) ?? nextStatus);
        setRejectionReason(saved.rejection_reason ?? null);
      }

      setSuccess(true);
      if (nextStatus === 'pending') setRejectionReason(null);
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
    <div className="max-w-5xl mx-auto p-6">
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
      {approvalStatus !== 'approved' && (
        <div
          className={`mb-4 rounded-lg border p-4 ${
            approvalStatus === 'rejected'
              ? 'bg-red-50 border-red-300 text-red-800'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          {approvalStatus === 'pending' && (
            <p>
              Dein Profil ist <strong>zur Prüfung eingereicht</strong>. Ein Admin schaut es sich zeitnah an. Solange es nicht freigegeben ist, wirst du nicht als Künstler gelistet und erhältst keine Anfragen.
            </p>
          )}
          {approvalStatus === 'rejected' && (
            <div>
              <p className="font-semibold">Dein Profil wurde leider abgelehnt.</p>
              {rejectionReason && (
                <p className="mt-1"><span className="font-medium">Grund:</span> {rejectionReason}</p>
              )}
              <p className="mt-2">Passe dein Profil an und reiche es erneut ein.</p>
            </div>
          )}
          {approvalStatus === 'unsubmitted' && (
            <p>
              Reiche dein Profil zur <strong>Freigabe</strong> ein. Erst nach Freigabe wirst du auf der Künstlerseite angezeigt und kannst Anfragen erhalten.
            </p>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basisdaten */}
        <div className="bg-stone-100 border border-gray-200 rounded-lg p-5 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-black">Basisdaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium text-black">Name*</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded text-black"
                required
                disabled={locked}
              />
            </div>
            {/* Adresse */}
            <div>
              <label className="block mb-1 font-medium text-black">Adresse*</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border px-3 py-2 rounded text-black"
                required
                disabled={locked}
              />
            </div>
            {/* Telefonnummer */}
            <div>
              <label className="block mb-1 font-medium text-black">Telefonnummer*</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="w-full border px-3 py-2 rounded text-black"
                required
                disabled={locked}
              />
            </div>
          </div>
        </div>

        {/* Disziplinen */}
        <div className="bg-stone-100 border border-gray-200 rounded-lg p-5 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-black">Disziplinen</h2>
          <div className="flex flex-wrap gap-2">
            {disciplinesOptions.map(d => (
              <button
                type="button"
                key={d}
                onClick={() => toggleDiscipline(d)}
                disabled={locked}
                className={`px-3 py-1 border rounded ${disciplines.includes(d) ? "bg-blue-600 text-white" : "bg-white text-black"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Preise */}
        <div className="bg-stone-100 border border-gray-200 rounded-lg p-5 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-black">Preisrahmen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-black">Preis (min)*</label>
              <input
                type="number"
                value={priceMin}
                onChange={e => setPriceMin(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded text-black"
                min={0}
                required
                disabled={locked}
              />
              <p className="mt-1 text-sm text-black">
                Realistischer Richtwert für ein Teamevent (ca. 150 Personen, 5‑Minuten‑Act, ohne Anfahrtskosten). Nur Gage + ggf. Material.
              </p>
            </div>
            <div>
              <label className="block mb-1 font-medium text-black">Preis (max)*</label>
              <input
                type="number"
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded text-black"
                min={priceMin}
                required
                disabled={locked}
              />
              <p className="mt-1 text-sm text-black">
                Oberer Rahmen für denselben Event‑Case (150 Gäste, 5‑Minuten‑Act, ohne Anfahrt).
              </p>
            </div>
          </div>
        </div>

        {/* Profilbild */}
        <div className="bg-stone-100 border border-gray-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-black">Profilbild</h2>
          <div className="mb-3 rounded-md border-2 border-dashed border-gray-300 bg-white p-3">
            <p className="text-sm font-medium text-black">Bitte so hochladen:</p>
            <ul className="list-disc list-inside text-sm text-black">
              <li>Gesicht sichtbar</li>
              <li>Quadratisches Format</li>
              <li>Am liebsten WebP (
                <a href="https://ezgif.com/png-to-webp" target="_blank" rel="noreferrer" className="underline">PNG → WebP</a>
                )
              </li>
              <li>
                <a href="https://ezgif.com/jpg-to-webp" target="_blank" rel="noreferrer" className="underline">JPG → WebP</a>
              </li>
            </ul>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={e => setProfileImageFile(e.target.files?.[0] ?? null)}
            disabled={locked}
            className="w-full"
          />
          <button
            type="button"
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"][accept="image/*"]')?.click()}
            disabled={locked}
            className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Profilbild hochladen
          </button>
          {profileImageUrl && (
            <img src={profileImageUrl} alt="Profilbild" className="mt-2 h-24 rounded object-cover" />
          )}
        </div>

        {/* Galerie */}
        <div className="bg-stone-100 border border-gray-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-black">Galerie</h2>
          <p className="text-sm mb-2 text-black">Divers, Format 4:3 (breiter als höher). Idealerweise WebP.</p>
          <button
            type="button"
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"][multiple]')?.click()}
            disabled={locked}
            className="mb-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Galerie-Bilder hochladen
          </button>
          <GalleryUploader
            locked={locked}
            galleryUrls={galleryUrls}
            setGalleryUrls={setGalleryUrls}
            galleryFiles={galleryFiles}
            setGalleryFiles={setGalleryFiles}
          />
        </div>

        {/* Über mich */}
        <div className="bg-stone-100 border border-gray-200 rounded-lg p-5 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold mb-2 text-black">Über mich</h2>
          <p className="mb-2 text-sm text-black">Dieser Text erscheint auf der Homepage unter deiner Karte. Sei kreativ, aber halte dich kurz.</p>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            disabled={locked}
            className="w-full border px-3 py-2 rounded h-28 text-black"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading || locked}
            className="w-full bg-green-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {locked
              ? "Profil gesperrt"
              : loading
                ? "Speichern..."
                : approvalStatus === 'approved'
                  ? 'Änderungen speichern'
                  : approvalStatus === 'pending'
                    ? 'Zur Prüfung eingereicht'
                    : 'Zur Prüfung einreichen'}
          </button>
        </div>
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