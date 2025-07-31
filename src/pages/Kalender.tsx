import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useAuth } from '@/context/AuthContext';

type AvailabilitySlot = { id: number; date: string }; // expecting YYYY-MM-DD

const CalendarPage: React.FC = () => {
  const { token, user, supabase } = useAuth();
  const supabaseUserId = (user as any)?.id || (user as any)?.sub || null;
  const [available, setAvailable] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendArtistId, setBackendArtistId] = useState<string | null>(null);
  const [profileFetchTried, setProfileFetchTried] = useState(false);
  const [profileMissingBackendArtistId, setProfileMissingBackendArtistId] = useState(false);
  const artistIdLoadingRef = React.useRef(false);

  const loadArtistId = async () => {
    if (artistIdLoadingRef.current) return;
    if (!supabase || !supabaseUserId) {
      if (!supabase) console.warn('Supabase client not ready yet, skipping loadArtistId');
      if (!supabaseUserId) console.warn('No supabaseUserId resolved yet, cannot load backendArtistId');
      return;
    }
    artistIdLoadingRef.current = true;
    try {
      try {
        console.log('Loading profile to get backend_artist_id for user', supabaseUserId);
        const { data, error } = await supabase
          .from('profiles')
          .select('backend_artist_id')
          .eq('user_id', supabaseUserId)
          .maybeSingle();
        console.log('Supabase profile fetch returned', { data, error });
        setProfileFetchTried(true);
        if (error) {
          console.warn('Could not load profile for artist id', error);
          return;
        }
        if (data?.backend_artist_id) {
          setBackendArtistId(data.backend_artist_id);
          setProfileMissingBackendArtistId(false);
        } else {
          setProfileMissingBackendArtistId(true);
          console.log('No backend_artist_id found in profile, attempting fallback by email', (user as any)?.email);
          if ((user as any)?.email) {
            try {
              const res = await fetch(`${import.meta.env.VITE_API_URL}/api/artists`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok) {
                console.warn('Fallback fetch to /api/artists failed:', res.status);
              } else {
                const artists = await res.json();
                const userEmail = ((user as any).email as string).toLowerCase();
                const match = artists.find((a: any) => a.email && a.email.toLowerCase() === userEmail);
                if (match) {
                  console.log('Fallback succeeded: found matching artist by email', match);
                  setBackendArtistId(match.id);
                  setProfileMissingBackendArtistId(false);
                  // Upsert profile with backend_artist_id
                  const { error: upsertError } = await supabase
                    .from('profiles')
                    .upsert({ user_id: supabaseUserId, backend_artist_id: match.id });
                  if (upsertError) {
                    console.warn('Failed to upsert profile with backend_artist_id during fallback', upsertError);
                  }
                } else {
                  console.warn('Fallback did not find any matching artist by email');
                }
              }
            } catch (fetchErr) {
              console.warn('Exception during fallback fetch to /api/artists', fetchErr);
            }
          } else {
            console.warn('No email available on user object for fallback');
          }
        }
      } catch (e) {
        console.warn('Exception loading artist id', e);
      }
    } finally {
      artistIdLoadingRef.current = false;
    }
  };

  useEffect(() => {
    if (!token || !supabaseUserId) return;
    let cancelled = false;
    const waitAndLoad = async () => {
      const maxTries = 10;
      for (let i = 0; i < maxTries && !cancelled; i++) {
        if (supabase) {
          await loadArtistId();
          return;
        }
        await new Promise((r) => setTimeout(r, 200));
      }
      if (!cancelled) {
        console.warn('Supabase client never became ready for loadArtistId after retries');
      }
    };
    waitAndLoad();
    return () => { cancelled = true; };
  }, [supabase, supabaseUserId, token, user]);

  useEffect(() => {
    console.log("DEBUG: user object:", user);
    console.log("DEBUG: resolved supabaseUserId:", supabaseUserId);
    console.log("DEBUG: backendArtistId state:", backendArtistId);
    // expose for manual console inspection
    (window as any).__CAL_DEBUG = { user, backendArtistId, supabaseUserId };
  }, [user, backendArtistId, supabaseUserId]);

  const fetchAvailability = async () => {
    if (!token) return;
    console.log('fetchAvailability for artist', backendArtistId);
    setLoading(true);
    setError(null);
    try {
      const url = backendArtistId
        ? `${import.meta.env.VITE_API_URL}/api/availability?artist_id=${backendArtistId}`
        : `${import.meta.env.VITE_API_URL}/api/availability`;
      console.log('Fetching availability from URL:', url);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      if (!res.ok) {
        console.error('fetchAvailability error response', res.status, text);
        let msg = `Fehler beim Laden: ${res.status}`;
        try {
          const parsed = JSON.parse(text);
          if (parsed.detail) msg += ` - ${parsed.detail}`;
          else if (parsed.message) msg += ` - ${parsed.message}`;
        } catch {}
        setError(msg);
        return;
      }
      // parse success response
      let data: AvailabilitySlot[] = [];
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.warn('Could not parse availability JSON:', parseErr, text);
        setError('Antwort des Backends konnte nicht verstanden werden.');
        return;
      }
      setAvailable(data);
    } catch (err: any) {
      console.error('fetchAvailability network error', err);
      setError('Verfügbarkeit konnte nicht geladen werden. Netzwerk- oder Serverproblem.');
    } finally {
      setLoading(false);
    }
  };

  const addAvailability = async (date: Date) => {
    if (!token) return;
    const iso = date.toISOString().split("T")[0];
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(backendArtistId ? { date: iso, artist_id: backendArtistId } : { date: iso }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Add failed: ${res.status} ${text}`);
      }
      const newSlot: AvailabilitySlot = await res.json();
      setAvailable((prev) => [...prev, newSlot]);
    } catch (err: any) {
      console.error("addAvailability error", err);
      setError("Verfügbarkeit konnte nicht hinzugefügt werden.");
    }
  };

  const removeAvailability = async (slot: AvailabilitySlot) => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/availability/${slot.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Remove failed: ${res.status} ${text}`);
      }
      setAvailable((prev) => prev.filter((s) => s.id !== slot.id));
    } catch (err: any) {
      console.error("removeAvailability error", err);
      setError("Verfügbarkeit konnte nicht entfernt werden.");
    }
  };

  useEffect(() => {
    if (!backendArtistId) return; // wait for artist linkage
    fetchAvailability();
  }, [token, backendArtistId]);

  // helper to check if date is available
  const isAvailable = (date: Date) => {
    const iso = date.toISOString().split("T")[0];
    return available.some((s) => s.date === iso);
  };

  const handleDayClick = async (date: Date | undefined, _: any, event?: React.MouseEvent) => {
    if (event) event.preventDefault();
    if (!date) return;
    setError(null);
    try {
      if (isAvailable(date)) {
        const iso = date.toISOString().split("T")[0];
        const slot = available.find((s) => s.date === iso);
        if (slot) {
          await removeAvailability(slot);
        }
      } else {
        await addAvailability(date);
      }
    } catch (e: any) {
      console.error('handleDayClick error', e);
      setError('Fehler beim Verarbeiten des Tages.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Buchungskalender</h1>
      {error && (
        <div className="mb-2 text-red-600 flex items-center gap-3">
          <div>{error}</div>
          <button
            className="text-sm underline"
            onClick={() => fetchAvailability()}
          >
            Nochmal laden
          </button>
        </div>
      )}
      {loading && <div className="mb-2">Lade Verfügbarkeit…</div>}
      {!backendArtistId && profileFetchTried && (
        <div className="mb-2 text-sm text-gray-400">
          Profil noch nicht vollständig verknüpft, deshalb werden keine Verfügbarkeiten geladen.
        </div>
      )}
      {profileFetchTried && profileMissingBackendArtistId && (
        <div className="mb-2 text-sm text-yellow-500 flex items-center gap-2">
          <div>Profil hat keinen verknüpften Backend-Artist. Du kannst es versuchen erneut zu synchronisieren.</div>
          <button
            className="underline text-sm"
            onClick={() => loadArtistId()}
          >
            Erneut synchronisieren
          </button>
        </div>
      )}
      <DayPicker
        mode="multiple"
        selected={available.map((s) => new Date(s.date))}
        onDayClick={handleDayClick as any}
        numberOfMonths={1}
      />
      {error && error.startsWith("Fehler beim Laden: 500") && (
        <div className="mt-2 text-sm text-yellow-700">
          Wenn weiterhin 500 kommt: Backend-Logs checken oder Token prüfen.
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Verfügbare Tage</h2>
        {available.length === 0 && <p>Keine Tage als verfügbar markiert.</p>}
        <ul className="space-y-1">
          {available
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((slot) => (
              <li key={slot.id} className="flex items-center justify-between">
                <span>{slot.date}</span>
                <button
                  className="text-sm underline"
                  onClick={() => removeAvailability(slot)}
                >
                  Entfernen
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarPage;