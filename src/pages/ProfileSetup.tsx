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

async function updateBackendArtist(token: string, artistId: string, artistPayload: any) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${baseUrl}/api/artists/${artistId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(artistPayload),
  });
  const text = await res.text();
  if (!res.ok) {
    // handle common errors
    if (res.status === 409) {
      throw new Error('Email already exists');
    }
    if (res.status === 404) {
      throw new Error('Artist not found');
    }
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

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
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
        setPriceMax(data.price_max || 2000);
        if (data.backend_artist_id) {
          setBackendArtistId(data.backend_artist_id);
          setLocked(true);
        }
      }
    };
    loadProfile();
  }, [user]);

  async function createOrFetchBackendArtist(token: string, email: string, artistPayload: any) {
    const baseUrl = import.meta.env.VITE_API_URL;
    // Generate a fallback password if backend requires one (since password_hash is required server-side)
    const password = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
      ? (crypto as any).randomUUID()
      : Math.random().toString(36).substring(2);
    const creationPayload = { ...artistPayload, password };
    // Try to create the artist
    let res = await fetch(`${baseUrl}/api/artists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(creationPayload),
    });
    if (res.ok) {
      const body = await res.json();
      return body.id ?? null;
    }
    const text = await res.text();
    console.warn('createOrFetchBackendArtist failed response:', res.status, text);
    // If email conflict or similar, fallback to fetching existing artist by email
    if (res.status === 409 || text.toLowerCase().includes('email')) {
      const listRes = await fetch(`${baseUrl}/api/artists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (listRes.ok) {
        const list = await listRes.json();
        const match = list.find((a: any) => a.email?.toLowerCase() === email.toLowerCase());
        if (match) return match.id;
      }
    }
    throw new Error(`Backend createArtist failed: ${res.status} ${text}`);
  }

  const [success, setSuccess] = useState(false);
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
    // Save profile data to Supabase (example, adjust table name)
    const { data, error: supabaseError } = await supabase
      .from("profiles")
      .upsert({
        user_id: user!.sub,
        name,
        address,
        phone_number: phoneNumber,
        disciplines,
        price_min: priceMin,
        price_max: priceMax,
        is_complete: true,
      })
      .eq("user_id", user!.sub);

    setLoading(false);
    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setSuccess(true);
      // Auch Artist im Backend anlegen oder holen, wenn noch nicht vorhanden
      try {
        // Hole aktuellen Profil-Datensatz, um backend_artist_id zu prüfen
        const { data: profile } = await supabase
          .from('profiles')
          .select('backend_artist_id')
          .eq('user_id', user!.sub)
          .single();

        if (profile?.backend_artist_id) {
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
              // versuche zu updaten
              const updatedId = await updateBackendArtist(token!, profile.backend_artist_id, artistPayload);
              await supabase
                .from('profiles')
                .upsert({ user_id: user!.sub, backend_artist_id: updatedId })
                .eq('user_id', user!.sub);
              setBackendArtistId(updatedId);
              setLocked(true);
            } catch (err: any) {
              if (err.message === 'Artist not found') {
                // fallback: neu erstellen
                const backendRespId = await createOrFetchBackendArtist(token!, user.email, artistPayload);
                if (backendRespId) {
                  await supabase
                    .from('profiles')
                    .upsert({ user_id: user!.sub, backend_artist_id: backendRespId })
                    .eq('user_id', user!.sub);
                  setBackendArtistId(backendRespId);
                  setLocked(true);
                }
              } else {
                throw err; // wird im outer catch behandelt
              }
            }
          } else {
            setBackendArtistId(profile.backend_artist_id);
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
              .upsert({ user_id: user!.sub, backend_artist_id: backendRespId })
              .eq('user_id', user!.sub);
            setBackendArtistId(backendRespId);
            setLocked(true);
          }
        }
      } catch (err) {
        console.error('Error syncing artist with backend:', err);
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
      {locked && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
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
    </div>
);
}