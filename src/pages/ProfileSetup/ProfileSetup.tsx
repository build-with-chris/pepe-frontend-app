import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import GuidelinesModal from "@/components/GuidelinesModal";
import GalleryUploader from "@/components/GalleryUploader";
import { uploadProfileImage, uploadGalleryImages } from "@/lib/storage/upload";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { ProfileForm } from "./components/ProfileForm";

const PROFILE_BUCKET = import.meta.env.VITE_SUPABASE_PROFILE_BUCKET || "profiles";
const baseUrl = import.meta.env.VITE_API_URL;


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
        setGalleryFiles([]);
        setApprovalStatus((saved.approval_status as any) ?? nextStatus);
        setRejectionReason(saved.rejection_reason ?? null);
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const profile = {
    name,
    address,
    phoneNumber,
    disciplines,
    priceMin,
    priceMax,
    bio,
    profileImageUrl,
    galleryUrls,
    galleryFiles,
  };

  const setProfileAdapter = (next: any) => {
    if (typeof next.name !== "undefined") setName(next.name);
    if (typeof next.address !== "undefined") setAddress(next.address);
    if (typeof next.phoneNumber !== "undefined") setPhoneNumber(next.phoneNumber);
    if (typeof next.disciplines !== "undefined") setDisciplines(next.disciplines as string[]);
    if (typeof next.priceMin !== "undefined") setPriceMin(next.priceMin as number);
    if (typeof next.priceMax !== "undefined") setPriceMax(next.priceMax as number);
    if (typeof next.bio !== "undefined") setBio(next.bio as string);
    if (typeof next.profileImageUrl !== "undefined") setProfileImageUrl(next.profileImageUrl as string | null);
    if (typeof next.galleryUrls !== "undefined") setGalleryUrls(next.galleryUrls as string[]);

    // Accept file selections from ProfileForm and create local previews
    if (typeof next.profileImageFile !== "undefined" && next.profileImageFile) {
      const file = next.profileImageFile as File;
      setProfileImageFile(file);
      try {
        const preview = URL.createObjectURL(file);
        setProfileImageUrl(preview);
      } catch {}
    }

    if (typeof next.galleryFiles !== "undefined" && next.galleryFiles) {
      const files = next.galleryFiles as File[];
      setGalleryFiles(files);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Profil einrichten</h1>
        {locked && (
          <button
            type="button"
            onClick={() => {
              setLocked(false);
              setSuccess(false);
            }}
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md border border-gray-700 shadow"
            aria-label="Profil bearbeiten"
          >
            <Pencil className="w-4 h-4" />
            Profil bearbeiten
          </button>
        )}
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && (
        <div className="mb-4 text-green-300 bg-green-900/20 border border-green-700 rounded p-3">
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
      <ProfileForm
        profile={profile}
        setProfile={setProfileAdapter}
        locked={locked}
        onSubmit={handleSubmit}
      />
      {backendDebug && (
        <div className="mt-4 p-3 bg-gray-900 border border-gray-800 rounded text-xs whitespace-pre-wrap text-gray-300">
          <strong>Debug Log:</strong>
          <div>{backendDebug}</div>
        </div>
      )}
      <GuidelinesModal />
    </div>
  );
}