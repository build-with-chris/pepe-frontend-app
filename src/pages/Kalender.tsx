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
  const modifiersClassNames = { available: 'bg-green-500/80 text-white rounded-full transition-colors' };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [processingRange, setProcessingRange] = useState(false);

  const getDateRange = (start: Date, end: Date) => {
    const dates: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // lokale YYYY-MM-DD Formatierung, vermeidet UTC Off-by-One
  const formatISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

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
    console.log("AVAILABLE STATE UPDATED:", available);
    }, [available]);

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
        data.map(d => formatISODate(new Date(d.date)))
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
  const iso = formatISODate(date);
  if (available.some((s) => s.date === iso)) return; // schon vorhanden

  // Optimistischer Eintrag (temporär)
  const tempSlot: AvailabilitySlot = { id: -Date.now(), date: iso };
  setAvailable((prev) => [...prev, tempSlot]);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/availability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(backendArtistId ? { date: iso, artist_id: backendArtistId } : { date: iso }),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("addAvailability failed", res.status, text);
      // Rückgängig machen
      setAvailable((prev) => prev.filter((s) => s.id !== tempSlot.id));
      throw new Error(`Add failed: ${res.status} ${text}`);
    }

    let newSlot: AvailabilitySlot;
    try {
      newSlot = JSON.parse(text);
    } catch (parseErr) {
      console.warn("Could not parse created availability, using fallback", parseErr, text);
      newSlot = { id: tempSlot.id, date: iso }; // behalte temporären Eintrag
    }

    setAvailable((prev) => {
      const withoutTemp = prev.filter((s) => s.id !== tempSlot.id && s.date !== iso);
      return [...withoutTemp, newSlot];
    });
  } catch (err: any) {
    console.error("addAvailability error", err);
    setError("Verfügbarkeit konnte nicht hinzugefügt werden.");
  }
};

  const removeAvailability = async (slot: AvailabilitySlot) => {
    if (!token) return;
    // optimistische Entfernung direkt
    setAvailable((prev) => prev.filter((s) => s.id !== slot.id));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/availability/${slot.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Remove failed: ${res.status} ${text}`);
      }
    } catch (err: any) {
      console.error("removeAvailability error", err);
      setError("Verfügbarkeit konnte nicht entfernt werden.");
      // im Fehlerfall zurückrollen
      setAvailable((prev) => [...prev, slot]);
    }
  };

  useEffect(() => {
    if (!backendArtistId || loadingArtistId) return; // wait for artist linkage
    fetchAvailability();
  }, [token, backendArtistId, loadingArtistId]);

  // helper to check if date is available
  const isAvailable = (date: Date) => {
    const iso = formatISODate(date);
    return available.some((s) => s.date === iso);
  };

 const handleDayClick = async (date: Date | undefined, _: any, event?: React.MouseEvent) => {
  if (event) event.preventDefault();
  if (!date) return;
  setError(null);

  // wenn kein Range läuft oder der vorherige abgeschlossen ist, neuen starten
  if (!rangeStart || (rangeStart && rangeEnd)) {
    setRangeStart(date);
    setRangeEnd(null);
    return;
  }

  // Start gesetzt, aber noch kein Ende
  if (rangeStart && !rangeEnd) {
    if (date < rangeStart) {
      setRangeStart(date);
      return;
    }

    // gleicher Tag: sofort toggeln (einzeln) ohne await, optimistisches UI
    if (date.getTime() === rangeStart.getTime()) {
      const iso = formatISODate(date);
      const already = available.some((s) => s.date === iso);
      if (already) {
        const slot = available.find((s) => s.date === iso);
        if (slot) {
          removeAvailability(slot);
        }
      } else {
        addAvailability(date);
      }
      setRangeStart(null);
      setRangeEnd(null);
      return;
    }

    // gültiges Enddatum wählen
    setRangeEnd(date);
    return;
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
      <div className="mt-4">
        {rangeStart && !rangeEnd && (
          <div className="mb-2">
            <strong>Enddatum wählen.</strong>
            <button
              className="ml-4 underline text-sm"
              onClick={() => { setRangeStart(null); setRangeEnd(null); }}
            >
              Abbrechen
            </button>
          </div>
        )}
        {rangeStart && rangeEnd && (
          (() => {
            const datesInRange = getDateRange(rangeStart, rangeEnd);
            const isoRange = datesInRange.map(d => formatISODate(d));
            const availableInRange = isoRange.filter(d => available.some(s => s.date === d));
            const allAvailable = availableInRange.length === isoRange.length;
            const noneAvailable = availableInRange.length === 0;
            const title = `${rangeStart.toLocaleDateString()} bis ${rangeEnd.toLocaleDateString()}`;
            return (
              <div className="mb-3 p-3 border rounded bg-gray-800 text-white flex flex-col gap-2">
                <div>Ausgewählter Zeitraum: <strong>{title}</strong></div>
                <div className="flex gap-2">
                  {allAvailable && (
                    <button
                      className="px-3 py-1 bg-red-600 rounded"
                      disabled={processingRange}
                      onClick={async () => {
                        setProcessingRange(true);
                        try {
                          // alle entfernen
                          for (const iso of isoRange) {
                            const slot = available.find(s => s.date === iso);
                            if (slot) await removeAvailability(slot);
                          }
                        } finally {
                          setProcessingRange(false);
                          setRangeStart(null);
                          setRangeEnd(null);
                        }
                      }}
                    >
                      Verfügbarkeit löschen für {title}
                    </button>
                  )}
                  {noneAvailable && (
                    <button
                      className="px-3 py-1 bg-green-600 rounded"
                      disabled={processingRange}
                      onClick={async () => {
                        setProcessingRange(true);
                        try {
                          // alle hinzufügen
                          for (const iso of isoRange) {
                            await addAvailability(new Date(iso));
                          }
                        } finally {
                          setProcessingRange(false);
                          setRangeStart(null);
                          setRangeEnd(null);
                        }
                      }}
                    >
                      Verfügbarkeit hinzufügen für {title}
                    </button>
                  )}
                  {!allAvailable && !noneAvailable && (
                    <>
                      <button
                        className="px-3 py-1 bg-green-600 rounded"
                        disabled={processingRange}
                        onClick={async () => {
                          setProcessingRange(true);
                          try {
                            for (const iso of isoRange) {
                              if (!available.some(s => s.date === iso)) {
                                await addAvailability(new Date(iso));
                              }
                            }
                          } finally {
                            setProcessingRange(false);
                            setRangeStart(null);
                            setRangeEnd(null);
                          }
                        }}
                      >
                        Alle als verfügbar setzen
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 rounded"
                        disabled={processingRange}
                        onClick={async () => {
                          setProcessingRange(true);
                          try {
                            for (const iso of isoRange) {
                              const slot = available.find(s => s.date === iso);
                              if (slot) await removeAvailability(slot);
                            }
                          } finally {
                            setProcessingRange(false);
                            setRangeStart(null);
                            setRangeEnd(null);
                          }
                        }}
                      >
                        Alle entfernen
                      </button>
                    </>
                  )}
                  <button
                    className="ml-auto underline text-sm"
                    onClick={() => { setRangeStart(null); setRangeEnd(null); }}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            );
          })()
        )}
      </div>
      {error && error.startsWith("Fehler beim Laden: 500") && (
        <div className="mt-2 text-sm text-yellow-700">
          Wenn weiterhin 500 kommt: Backend-Logs checken oder Token prüfen.
        </div>
      )}
    </div>
  );
};

export default CalendarPage;