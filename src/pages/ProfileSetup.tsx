import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user!.sub)
          .single();
        if (data) {
          setName(data.name || '');
          setAddress(data.address || '');
          setPhoneNumber(data.phone_number || '');
          setDisciplines(data.disciplines || []);
          setPriceMin(data.price_min || 500);
          setPriceMax(data.price_max || 700);
          if (data.backend_artist_id) {
            setBackendArtistId(data.backend_artist_id);
            setLocked(true);
          }
        }
      } catch (err) {
        console.error('Error loading profile from Supabase', err);
        setBackendDebug(`Load profile failed: ${err}`);
      }
    };
    loadProfile();
  }, [user]);

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
      setError("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    if (priceMin > priceMax) {
      setError("Das Minimum darf nicht größer als das Maximum sein.");
      return;
    }
    setLoading(true);
    // Save profile data to Supabase (example, adjust table name)
    const payload = {
      user_id: user!.sub,
      name,
      address,
      phone_number: phoneNumber,
      disciplines,
      price_min: priceMin,
      price_max: priceMax,
      is_complete: true,
    };
    const { data, error: supabaseError } = await supabase
      .from("profiles")
      .upsert(payload);

    console.log('Supabase upsert payload', { name, address, phoneNumber, disciplines, priceMin, priceMax });
    console.log('Supabase response', { data, supabaseError });

    setLoading(false);
    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setSuccess(true);
      // Auch Artist im Backend anlegen oder holen, wenn noch nicht vorhanden
      try {
        // Hole aktuellen Profil-Datensatz, um backend_artist_id zu prüfen
        let profileBackendArtistId: string | null = null;
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('backend_artist_id')
            .eq('user_id', user!.sub)
            .maybeSingle();
          if (profileError) {
            console.warn('Error fetching profile backend_artist_id:', profileError);
          } else if (profile?.backend_artist_id) {
            profileBackendArtistId = profile.backend_artist_id;
          }
        } catch (fetchErr) {
          console.warn('Exception fetching profile backend_artist_id:', fetchErr);
        }

        const effectiveBackendId = profileBackendArtistId || backendArtistId;
        if (effectiveBackendId) {
          if (!locked) {
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
            try {
              console.log('Updating existing backend artist', effectiveBackendId);
              const updatedId = await updateBackendArtist(token!, effectiveBackendId, artistPayload, setBackendDebug);
              await supabase
                .from('profiles')
                .upsert({ user_id: user!.sub, backend_artist_id: updatedId });
              setBackendArtistId(updatedId);
              setLocked(true);
            } catch (err: any) {
              if (err.message === 'Artist not found') {
                // fallback: neu erstellen
                const backendRespId = await createOrFetchBackendArtist(token!, user.email, {
                  name,
                  email: user.email,
                  address,
                  phone_number: phoneNumber,
                  disciplines,
                  price_min: priceMin,
                  price_max: priceMax,
                });
                if (backendRespId) {
                  await supabase
                    .from('profiles')
                    .upsert({ user_id: user!.sub, backend_artist_id: backendRespId });
                  setBackendArtistId(backendRespId);
                  setLocked(true);
                }
              } else {
                setError('Künstler konnte nicht aktualisiert werden.');
              }
            }
          } else {
            setBackendArtistId(effectiveBackendId);
            setLocked(true);
          }
        } else {
          // neu anlegen wie vorher
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
          const backendRespId = await createOrFetchBackendArtist(token!, user.email, artistPayload);
          if (backendRespId) {
            await supabase
              .from('profiles')
              .upsert({ user_id: user!.sub, backend_artist_id: backendRespId });
            setBackendArtistId(backendRespId);
            setLocked(true);
          }
        }
      } catch (err) {
        console.error('Error syncing artist with backend:', err);
        setBackendDebug(prev => `Sync error: ${err}${prev ? '\n' + prev : ''}`);
        setError('Profil gespeichert, aber Künstler konnte nicht ans Backend synchronisiert werden. Versuch es später nochmal.');
      }
      // navigate("/dashboard");
    }
  };

  const toggleDiscipline = (d: string) => {
    if (locked) return;
    setDisciplines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profil einrichten</h1>
      {/* locked notice removed from top */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && (
        <div className="mb-4 text-green-700 bg-green-100 border border-green-400 rounded p-3">
          Profil erfolgreich gespeichert!
          <button
            className="ml-4 text-green-900 underline"
            onClick={() => navigate("/dashboard")}
          >
            Zum Dashboard
          </button>
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
        <button
          type="submit"
          disabled={loading || locked}
          className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
        >
          {locked ? "Profil gesperrt" : loading ? "Speichern..." : "Profil speichern"}
        </button>
      </form>
      {locked && (
        <div className="mt-6 p-4 bg-transparent border border-white rounded-md text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]">
          <p className="mb-2">✅ Profil ist abgeschlossen und an das Backend gesendet. Es ist aktuell gesperrt.</p>
          <button
            type="button"
            className="underline"
            onClick={() => { setLocked(false); setSuccess(false); }}
          >
            Profil bearbeiten
          </button>
        </div>
      )}
      {backendDebug && (
        <div className="mt-4 p-3 bg-gray-100 border rounded text-xs whitespace-pre-wrap">
          <strong>Debug Log:</strong>
          <div>{backendDebug}</div>
        </div>
      )}
    </div>
); }