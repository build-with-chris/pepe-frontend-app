import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useNavigate } from "react-router-dom";

// Expose supabase globally in dev for easier console debugging
if (import.meta.env.DEV) {
  (window as any).supabase = supabase;
}

const PROFILE_BUCKET = import.meta.env.VITE_SUPABASE_PROFILE_BUCKET || 'profiles';
const LOCALSTORAGE_KEY_GUIDELINES = "guidelinesAccepted";

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

async function updateBackendArtist(token: string, artistId: string, artistPayload: any, setBackendDebug: React.Dispatch<React.SetStateAction<string | null>>) {
  console.groupCollapsed('updateBackendArtist');
  console.log('Payload:', artistPayload);
  const baseUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${baseUrl}/api/artists/${artistId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(artistPayload),
  });
  const text = await res.text();
  console.log('Response status:', res.status);
  console.log('Response body:', text);
  console.groupEnd();
  if (!res.ok) {
    // handle common errors
    if (res.status === 409) {
      setBackendDebug(`updateBackendArtist failed: Conflict 409`);
      throw new Error('Email already exists');
    }
    if (res.status === 404) {
      setBackendDebug(`updateBackendArtist failed: Not Found 404`);
      throw new Error('Artist not found');
    }
    setBackendDebug(`updateBackendArtist failed: ${res.status} ${text.slice(0, 200)}`);
    throw new Error(`Update artist failed: ${res.status} ${text}`);
  }
  try {
    const body = JSON.parse(text);
    return body.id ?? artistId;
  } catch {
    return artistId;
  }
}

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
  // Profile image and bio state
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bio, setBio] = useState<string>('');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  // Galerie-Fotos
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  // Guidelines Popup (erstes Login)
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [guidelinesChecked, setGuidelinesChecked] = useState(false);


  useEffect(() => {
    try {
      const accepted = localStorage.getItem(LOCALSTORAGE_KEY_GUIDELINES) === "true";
      if (!accepted) setIsGuidelinesOpen(true);
    } catch {
      // falls localStorage nicht verfügbar ist, einfach anzeigen
      setIsGuidelinesOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  // Debug: Log Supabase session & localStorage token presence on mount
  useEffect(() => {
    (async () => {
      try {
        const sessionResp = await supabase.auth.getSession();
        const session = sessionResp.data.session;
        console.log('🔐 Supabase session?', !!session, session?.user?.id || null);
        if (!session) {
          console.warn('⚠️ Keine Supabase-Session vorhanden. Storage-Uploads benötigen authenticated-Session (sonst RLS-Fehler).');
        }
        // Also show which localStorage key would hold the token
        const url = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
        if (url) {
          const ref = url.replace('https://', '').split('.')[0];
          const lsKey = `sb-${ref}-auth-token`;
          const raw = localStorage.getItem(lsKey);
          console.log('🔑 localStorage token present?', !!raw, 'key=', lsKey);
        }
      } catch (e) {
        console.error('❌ Supabase session check failed:', e);
      }
    })();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || !token) return;
      const baseUrl = import.meta.env.VITE_API_URL;
      try {
        const res = await fetch(`${baseUrl}/api/artists/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const t = await res.text().catch(() => '');
          console.warn('GET /api/artists/me failed', res.status, t);
          return;
        }
        const me = await res.json();
        setName(me.name || '');
        setAddress(me.address || '');
        setPhoneNumber(me.phone_number || '');
        setDisciplines(me.disciplines || []);
        setPriceMin(me.price_min ?? 700);
        setPriceMax(me.price_max ?? 900);
        setBio(me.bio || '');
        setProfileImageUrl(me.profile_image_url || null);
        setGalleryUrls(Array.isArray(me.gallery_urls) ? me.gallery_urls : []);
        if (me.id) {
          setBackendArtistId(String(me.id));
          setLocked(true);
        }
      } catch (err) {
        console.error('Error loading profile from backend', err);
        setBackendDebug(`Load backend profile failed: ${err}`);
      }
    };
    loadProfile();
  }, [user, token]);

  async function createOrFetchBackendArtist(token: string, email: string, artistPayload: any) {
  console.groupCollapsed('createOrFetchBackendArtist create attempt');
  const baseUrl = import.meta.env.VITE_API_URL;

  // Wenn wir schon eine backendArtistId im State haben, nichts neu machen
  if (backendArtistId) {
    console.log('createOrFetchBackendArtist: existing backendArtistId, skipping create', backendArtistId);
    console.groupEnd();
    return backendArtistId;
  }

  // Generate a fallback password if backend requires one (since password_hash is required server-side)
  const password = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
    ? (crypto as any).randomUUID()
    : Math.random().toString(36).substring(2);
  const creationPayload = { ...artistPayload, password };
  console.log('creationPayload', creationPayload);

  // Try to create the artist
  const res = await fetch(`${baseUrl}/api/artists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(creationPayload),
  });

  let text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = null;
  }
  console.log('Response status:', res.status);
  console.log('Response body:', body ?? text);
  console.groupEnd();

  if (res.ok) {
    return body?.id ?? null;
  }

  console.groupCollapsed('createOrFetchBackendArtist fallback search');
  console.warn('createOrFetchBackendArtist failed response:', res.status, text);

  // If conflict/email issue, try to find existing by email
  if (res.status === 409 || text.toLowerCase().includes('email')) {
    const listRes = await fetch(`${baseUrl}/api/artists`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let list: any[] = [];
    if (listRes.ok) {
      list = await listRes.json();
    }
    console.log('List from fallback search:', list);
    const match = list.find((a: any) => a.email?.toLowerCase() === email.toLowerCase());
    console.log('Match found:', match);
    if (match) {
      console.log('createOrFetchBackendArtist: fallback match found, persisting backendArtistId', match.id);
      setBackendArtistId(match.id);
      try {
        if (user) {
          await supabase
            .from('profiles')
            .upsert({ user_id: user.sub, backend_artist_id: match.id });
        }
      } catch (upsertErr) {
        console.warn('Failed to persist fallback backend_artist_id to Supabase', upsertErr);
      }
      console.groupEnd();
      return match.id;
    }
    console.groupEnd();
    // if we got 409 but couldn't find existing, throw specific error
    if (res.status === 409) {
      setBackendDebug(`createOrFetchBackendArtist conflict 409 but no existing found`); // preserve earlier debug pattern
      throw new Error('Email already exists');
    }
  } else {
    console.groupEnd();
  }

  setBackendDebug(`createOrFetchBackendArtist failed: ${res.status} ${text.slice(0, 200)}`);
  throw new Error(`Backend createArtist failed: ${res.status} ${text}`);
}

  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting profile', { name, address, phoneNumber, disciplines, priceMin, priceMax, backendArtistId, locked });
    setError(null);
    if (!name || !address || !phoneNumber || disciplines.length === 0) {
      setError('Bitte fülle alle Pflichtfelder aus.');
      return;
    }
    if (priceMin > priceMax) {
      setError('Das Minimum darf nicht größer als das Maximum sein.');
      return;
    }
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      if (!user?.email) throw new Error('User email fehlt');
      const artistPayload = {
        name,
        email: user.email,
        address,
        phone_number: phoneNumber,
        disciplines,
        price_min: priceMin,
        price_max: priceMax,
      };

      // Erstellen oder Aktualisieren im Backend
      let effectiveId = backendArtistId;
      if (effectiveId) {
        console.log('Updating existing backend artist', effectiveId);
        const updatedId = await updateBackendArtist(token!, effectiveId, artistPayload, setBackendDebug);
        setBackendArtistId(updatedId);
        effectiveId = updatedId;
      } else {
        const createdId = await createOrFetchBackendArtist(token!, user.email, artistPayload);
        if (!createdId) throw new Error('Konnte Künstler nicht anlegen');
        setBackendArtistId(createdId);
        effectiveId = createdId;
      }

      // Profilbild via Supabase Storage hochladen (nur Storage, keine Supabase-DB)
      let imageUrl: string | null = profileImageUrl ?? null;
      if (profileImageFile) {
        try {
          // Dateiendung robust ermitteln
          let ext = (profileImageFile.name.split('.').pop() || '').toLowerCase();
          if (!ext || ext.length > 5) {
            const mime = profileImageFile.type;
            if (mime === 'image/jpeg' || mime === 'image/jpg') ext = 'jpg';
            else if (mime === 'image/png') ext = 'png';
            else if (mime === 'image/webp') ext = 'webp';
            else ext = 'jpg';
          }
          const path = `artist/${effectiveId}/${Date.now()}.${ext}`;
      

          console.groupCollapsed('📤 Upload profile image');
          console.log('Bucket:', PROFILE_BUCKET);
          console.log('Path  :', path);
          console.log('Type  :', profileImageFile.type);
          console.log('Size  :', profileImageFile.size);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(PROFILE_BUCKET)
            .upload(path, profileImageFile, {
              contentType: profileImageFile.type || `image/${ext}`,
              // Wichtig: kein Upsert -> benötigt nur INSERT-Policy
              upsert: false,
            });



          if (uploadError) {
            console.error('❌ Supabase upload error:', uploadError);
            console.groupEnd();
            // Backend-URL nicht überschreiben, wenn Upload fehlschlägt
            setBackendDebug(prev => `Upload failed: ${uploadError.message || uploadError}\nBucket=${PROFILE_BUCKET}\nPath=${path}\n${prev ?? ''}`);
            throw uploadError;
          }

          const { data: pub } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path);
          imageUrl = pub.publicUrl;
          console.log('✅ publicUrl:', imageUrl);
          setProfileImageUrl(imageUrl);
          console.groupEnd();
        } catch (imgErr: any) {
          console.warn('Fehler beim Hochladen des Profilbilds:', imgErr?.message || imgErr);
        }
      }


      // Galerie-Fotos via Supabase hochladen (bis zu 3)
      let mergedGalleryUrls = [...galleryUrls]; // vorhandene behalten
      if (galleryFiles.length > 0) {
        try {
          const uploaded: string[] = [];
          for (let i = 0; i < galleryFiles.length; i++) {
            const file = galleryFiles[i];
            // Dateiendung bestimmen
            let ext = (file.name.split('.').pop() || '').toLowerCase();
            if (!ext || ext.length > 5) {
              const mime = file.type;
              if (mime === 'image/jpeg' || mime === 'image/jpg') ext = 'jpg';
              else if (mime === 'image/png') ext = 'png';
              else if (mime === 'image/webp') ext = 'webp';
              else ext = 'jpg';
            }
            const path = `artist/${effectiveId}/gallery/${Date.now()}-${i}.${ext}`;

            const { error: uploadErr } = await supabase.storage
              .from(PROFILE_BUCKET)
              .upload(path, file, {
                contentType: file.type || `image/${ext}`,
                upsert: false,
              });

            if (uploadErr) {
              console.warn('Galerie-Upload fehlgeschlagen:', uploadErr);
              continue;
            }
            const { data: pub } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path);
            if (pub?.publicUrl) uploaded.push(pub.publicUrl);
          }
          if (uploaded.length > 0) {
            mergedGalleryUrls = [...mergedGalleryUrls, ...uploaded].slice(0, 3); // max. 3
            setGalleryUrls(mergedGalleryUrls);
            setGalleryFiles([]); // Auswahl zurücksetzen
          }
        } catch (galleryErr) {
          console.warn('Fehler beim Galerie-Upload:', galleryErr);
        }
      }
      // Backend: Bild-URL & Bio synchronisieren (nur URL senden, wenn Upload/URL vorhanden)
      try {
        const payload: any = { bio: (bio ?? '').toString() };
        if (imageUrl) payload.profile_image_url = imageUrl;
        payload.gallery_urls = mergedGalleryUrls;
        const resp = await fetch(`${baseUrl}/api/artists/me/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const text = await resp.text();
        console.log('PATCH /api/artists/me/profile', resp.status, text);
        if (!resp.ok) {
          setBackendDebug(prev => `update /artists/me/profile failed: ${resp.status} ${text.slice(0,200)}\n${prev ?? ''}`);
        }
      } catch (syncErr: any) {
        console.warn('Fehler beim Sync ans Backend:', syncErr);
        setBackendDebug(prev => `Backend sync exception: ${syncErr?.message || syncErr}\n${prev ?? ''}`);
      }

      setSuccess(true);
      setLocked(true);
    } catch (err: any) {
      console.error('Error syncing artist with backend:', err);
      setError('Profil speichern fehlgeschlagen. Bitte später erneut versuchen.');
      setBackendDebug(prev => `Sync error: ${err?.message || err}${prev ? '\n' + prev : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleDiscipline = (d: string) => {
    if (locked) return;
    setDisciplines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const handleAcceptGuidelines = () => {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY_GUIDELINES, "true");
  } catch {}
  setIsGuidelinesOpen(false);
  };

  const handleLaterGuidelines = () => {
    // kein Flag setzen -> erscheint beim nächsten Besuch erneut
    setIsGuidelinesOpen(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Profil einrichten</h1>
        {locked && (
          <button
            type="button"
            onClick={() => { setLocked(false); setSuccess(false); }}
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
        <div>
          <label className="block mb-1 font-medium">Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={locked}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Adresse*</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={locked}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Telefonnummer*</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={locked}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Disziplinen*</label>
          <div className="flex flex-wrap gap-2">
            {disciplinesOptions.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => toggleDiscipline(d)}
                disabled={locked}
                className={`px-3 py-1 border rounded ${
                  disciplines.includes(d)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Preis (min)*</label>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
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
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded"
              min={priceMin}
              required
              disabled={locked}
            />
          </div>
        </div>
        {/* Profile image and bio fields */}
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
        <div>
  <label className="block mb-1 font-medium">Weitere Fotos (max. 3)</label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => {
      if (!e.target.files) return;
      const files = Array.from(e.target.files).slice(0, 3); // max. 3 Bilder
      setGalleryFiles(files);
    }}
    disabled={locked}
    className="w-full"
  />

  {/* Bereits gespeicherte Galerie-Bilder aus dem Backend */}
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

  {/* Neue (noch nicht hochgeladene) Bilder als Vorschau */}
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
        <div>
          <label className="block mb-1 font-medium">Über mich</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            disabled={locked}
            className="w-full border px-3 py-2 rounded h-24"
          />
        </div>
        {/* END Profile image and bio fields */}
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
      <Dialog open={isGuidelinesOpen} onOpenChange={setIsGuidelinesOpen}>
  <DialogContent className="max-w-xl sm:max-w-2xl text-left">
    <DialogHeader>
      <DialogTitle>Willkommen bei PepeShows 🎪</DialogTitle>
      <DialogDescription>
        Ein kurzer Überblick, wie die Plattform funktioniert – deine Rechte und unsere Standards.
      </DialogDescription>
    </DialogHeader>

    {/* TL;DR */}
    <div className="rounded-md bg-white/5 border border-white/10 p-3 text-sm text-gray-200">
      <strong>Kurz gesagt:</strong> Fair, sicher, transparent. Du entscheidest über Anfragen &amp; Gagen,
      wir kümmern uns um Matching, Vertrag &amp; Support. Medien bleiben deine – wir nutzen sie nur zur
      Bewerbung. Bitte antworte auf Anfragen innerhalb von <strong>24–48 h</strong> und halte
      Sicherheits‑/Venue‑Regeln ein.
    </div>

    {/* Volltext – scrollbar */}
    <ScrollArea className="max-h-[50vh] rounded-md border border-white/10 p-4 space-y-4">
      <section>
        <h4 className="font-semibold mb-1">So funktioniert’s</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
          <li><strong>Anfrage:</strong> Veranstalter nennen Datum, Ort, Rahmen.</li>
          <li><strong>Matching:</strong> Vorschläge nach Disziplin, Stil, Verfügbarkeit.</li>
          <li><strong>Angebot &amp; Zusage:</strong> Du setzt Konditionen, wir koordinieren Details.</li>
          <li><strong>Auftritt &amp; Abrechnung:</strong> Betreuung bis Abschluss &amp; Feedback.</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold mb-1">Deine Rechte</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
          <li>Transparente Infos vor Zusage.</li>
          <li>Freie Annahme/Ablehnung von Anfragen.</li>
          <li>Eigene Gagen; wir helfen bei der Kalkulation.</li>
          <li>Du bearbeitest/löschst Profil, Medien, Links jederzeit.</li>
          <li>Schneller, persönlicher Support.</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold mb-1">Unsere Standards</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
          <li>Zuverlässigkeit: Bestätigte Termine sind verbindlich.</li>
          <li>Antwortzeit: <strong>24–48 h</strong>.</li>
          <li>Professionalität &amp; Sicherheit (Rider, Venue‑Regeln).</li>
          <li>Fair Play: keine Umgehung vereinbarter Prozesse.</li>
          <li>Respekt &amp; Inklusion.</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold mb-1">Honorar &amp; Gebühren</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
          <li>Gage + Reisekosten/Spesen transparent im Angebot.</li>
          <li>Service‑Fee separat ausgewiesen.</li>
          <li>Zahlung i. d. R. nach Auftritt; Anzahlung möglich.</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold mb-1">Storno &amp; Ausfälle</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
          <li>Kundenseitig: Staffelung je nach Terminabstand.</li>
          <li>Artistenseitig: nur aus wichtigem Grund – Ersatzsuche durch uns.</li>
          <li>Höhere Gewalt: fairer Ausgleich nach Vertrag.</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold mb-1">Medien &amp; Datenschutz</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
          <li>Deine Medien bleiben dein Eigentum.</li>
          <li>Nutzung durch uns nur zur Bewerbung von dir/der Plattform.</li>
          <li>Datenexport &amp; -löschung jederzeit möglich.</li>
        </ul>
      </section>

      <div className="text-xs text-gray-400">
        Vollständige Bedingungen: <a href="/artist-guidelines" className="underline">/artist‑guidelines</a>
      </div>
    </ScrollArea>

    {/* Zustimmung */}
    <div className="flex items-start gap-3 pt-2">
      <Checkbox id="agree" checked={guidelinesChecked} onCheckedChange={(v) => setGuidelinesChecked(Boolean(v))} />
      <label htmlFor="agree" className="text-sm text-gray-200 select-none">
        Ich habe die Plattform‑Regeln gelesen und akzeptiere sie.
      </label>
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-2">
      <Button variant="ghost" onClick={handleLaterGuidelines}>
        Später lesen
      </Button>
      <Button onClick={handleAcceptGuidelines} disabled={!guidelinesChecked}>
        Akzeptieren &amp; weiter
      </Button>
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
}