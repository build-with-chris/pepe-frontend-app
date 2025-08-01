import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useAuth } from '@/context/AuthContext';

function useBackendArtistId(supabase: any, user: any, token: string | null) {
  const [backendArtistId, setBackendArtistId] = useState<string | null>(null);
  const [loadingArtistId, setLoadingArtistId] = useState(true);
  const [profileFetchTried, setProfileFetchTried] = useState(false);
  const [profileMissingBackendArtistId, setProfileMissingBackendArtistId] = useState(false);

  const load = async () => {
    if (!supabase || !user || !token) {
      setLoadingArtistId(false);
      return;
    }
    setLoadingArtistId(true);
    try {
      const supabaseUserId = user?.id || user?.sub;
      const email = user?.email;
      const { data, error } = await supabase
        .from('profiles')
        .select('backend_artist_id')
        .eq('user_id', supabaseUserId)
        .maybeSingle();
      setProfileFetchTried(true);
      if (!error && data?.backend_artist_id) {
        setBackendArtistId(data.backend_artist_id);
        setProfileMissingBackendArtistId(false);
        return;
      }
      setProfileMissingBackendArtistId(true);
      if (email) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/artists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const artists = await res.json();
          const match = artists.find((a: any) => a.email && a.email.toLowerCase() === email.toLowerCase());
          if (match) {
            setBackendArtistId(match.id);
            setProfileMissingBackendArtistId(false);
            // upsert for next time
            await supabase.from('profiles').upsert({ user_id: supabaseUserId, backend_artist_id: match.id });
          }
        }
      }
    } catch (e) {
      console.warn('Error resolving backendArtistId', e);
    } finally {
      setLoadingArtistId(false);
    }
  };

  // initial load and when dependencies change
  useEffect(() => {
    load();
  }, [supabase, user, token]);

  return { backendArtistId, loadingArtistId, profileFetchTried, profileMissingBackendArtistId, refreshArtistId: load };
}

type AvailabilitySlot = { id: number; date: string }; // expecting YYYY-MM-DD

const CalendarPage: React.FC = () => {
  const { token, user, supabase } = useAuth();
  const supabaseUserId = (user as any)?.id || (user as any)?.sub || null;
  const [available, setAvailable] = useState<AvailabilitySlot[]>([]);
  const availableDates = available.map((s) => new Date(s.date));
  const modifiers = { available: availableDates };
  const modifiersClassNames = { available: 'bg-green-500/80 text-white rounded-full' };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { backendArtistId, loadingArtistId, profileFetchTried, profileMissingBackendArtistId, refreshArtistId } =
    useBackendArtistId(supabase, user, token);

  useEffect(() => {
    console.log("DEBUG: user object:", user);
    console.log("DEBUG: resolved supabaseUserId:", supabaseUserId);
    console.log("DEBUG: backendArtistId state:", backendArtistId);
    // expose for manual console inspection
    (window as any).__CAL_DEBUG = { user, backendArtistId, supabaseUserId };
  }, [user, backendArtistId, supabaseUserId]);

  useEffect(() => {
    if (token) {
      console.log('🔐 Supabase JWT (prefix):', token.slice(0, 8) + '...');
      // expose full token for manual copy in console (temporary debug)
      (window as any).__DEBUG_SUPABASE_TOKEN = token;
    } else {
      console.log('Kein Supabase-Token vorhanden (noch nicht eingeloggt oder Session fehlt)');
    }
  }, [token]);

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
      console.log('Raw availability data count', data.length);
      console.log('Sample dates from backend', data.slice(0, 10).map(d => d.date));
      console.log(
        'Normalized selected dates for DayPicker',
        data.map(d => new Date(d.date).toISOString().split('T')[0])
      );
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
    if (!backendArtistId || loadingArtistId) return; // wait for artist linkage
    fetchAvailability();
  }, [token, backendArtistId, loadingArtistId]);

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
            onClick={() => refreshArtistId()}
          >
            Erneut synchronisieren
          </button>
        </div>
      )}
      <div className="text-sm mb-2 flex items-center gap-2">
        <div className="inline-block w-3 h-3 bg-green-500 rounded-full" />
        <div>Verfügbare Tage</div>
      </div>
      <DayPicker
        mode="multiple"
        selected={availableDates}
        numberOfMonths={1}
        onDayClick={handleDayClick as any}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
      />
      {error && error.startsWith("Fehler beim Laden: 500") && (
        <div className="mt-2 text-sm text-yellow-700">
          Wenn weiterhin 500 kommt: Backend-Logs checken oder Token prüfen.
        </div>
      )}
    </div>
  );
};

export default CalendarPage;