import React, { useState, useEffect, useMemo, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useAuth } from '@/context/AuthContext';
import { toLocalDate, formatISODate, getDateRange } from "@/utils/calendar";

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
      console.log("[useBackendArtistId] supabaseUserId:", supabaseUserId, "user.email:", email);
      const { data, error } = await supabase
        .from('profiles')
        .select('backend_artist_id')
        .eq('user_id', supabaseUserId)
        .maybeSingle();
      console.log("[useBackendArtistId] Supabase profile fetch result:", { data, error });
      setProfileFetchTried(true);
      if (!error && data?.backend_artist_id) {
        setBackendArtistId(data.backend_artist_id);
        setProfileMissingBackendArtistId(false);
        return;
      }
      setProfileMissingBackendArtistId(true);
      if (email) {
        console.log("[useBackendArtistId] No backend_artist_id found, fetching artists from backend for email:", email);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/artists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const artists = await res.json();
          console.log("[useBackendArtistId] Artists fetched from backend:", artists);
          const match = artists.find((a: any) => a.email && a.email.toLowerCase() === email.toLowerCase());
          if (match) {
            setBackendArtistId(match.id);
            setProfileMissingBackendArtistId(false);
            // upsert for next time
            const upsertResult = await supabase.from('profiles').upsert({ user_id: supabaseUserId, backend_artist_id: match.id });
            console.log("[useBackendArtistId] Upserted backend_artist_id to Supabase profile:", upsertResult);
          } else {
            console.log("[useBackendArtistId] No matching artist found for email:", email);
          }
        } else {
          const text = await res.text();
          console.warn("[useBackendArtistId] Failed to fetch artists from backend. Status:", res.status, "Response:", text);
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
  // Tick once per day at local midnight so the UI drops past days automatically
  const [todayTick, setTodayTick] = useState(0);

  // Start of today (local time)
  const startOfToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, [todayTick]);

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const ms = nextMidnight.getTime() - now.getTime() + 1000; // +1s safety
    const t = setTimeout(() => setTodayTick((x) => x + 1), ms);
    return () => clearTimeout(t);
  }, [todayTick]);

  // Only highlight future (and today) availability
  const futureAvailable = useMemo(() => {
    return available.filter((s) => {
      const d = new Date(s.date + 'T00:00:00');
      return d >= startOfToday;
    });
  }, [available, startOfToday]);

  const availableDates = (futureAvailable ?? []).map((s) => toLocalDate(s.date)).filter(Boolean) as Date[];
  // Matcher for blocked days: only future/today days NOT in available
  const blockedMatcher = (date: Date) => {
    if (date < startOfToday) return false;
    const iso = formatISODate(date);
    return !(available ?? []).some((s) => s.date === iso);
  };
  const modifiers = { available: availableDates, blocked: blockedMatcher };
  const disabledDays = { before: startOfToday };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [processingRange, setProcessingRange] = useState(false);

  // Merkt sich, für welches Datum (ISO) wir bereits automatisch Verfügbarkeit sichergestellt haben
  const lastEnsuredIsoRef = useRef<string | null>(null);
  // prevent flooding the API with concurrent add requests for the same day
  const inFlightAdd = useRef<Set<string>>(new Set());



  

  const { backendArtistId, loadingArtistId, profileFetchTried, profileMissingBackendArtistId, refreshArtistId } =
    useBackendArtistId(supabase, user, token);

  // Stellt sicher, dass ein Artist im Backend existiert und synchronisiert die ID in Supabase.profile
    const ensureAndSyncArtistId = async () => {
      if (!token) return null;
      try {
        console.log("[ensureAndSyncArtistId] About to call /api/artists/me/ensure with token (prefix):", token.slice(0, 8) + "...");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/artists/me/ensure`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        const text = await res.text();
        console.log("[ensureAndSyncArtistId] Response status:", res.status, "Text:", text);
        if (!res.ok) {
          console.warn('ensure failed', res.status, text);
          return null;
        }
        const data = JSON.parse(text);
        if (data?.id && supabase && supabaseUserId) {
          // schreibe die ID ins Supabase-Profil, damit wir sie stabil haben
          const upsertResult = await supabase.from('profiles').upsert({ user_id: supabaseUserId, backend_artist_id: data.id });
          console.log("[ensureAndSyncArtistId] Upserted backend_artist_id into Supabase profile:", upsertResult);
          await refreshArtistId();
        }
        return data;
      } catch (e) {
        console.warn('ensure error', e);
        return null;
      }
    };

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

  // Wenn das Profil geladen wurde, aber keine backendArtistId vorhanden ist, Artist erzwingen & danach Verfügbarkeit neu laden
  useEffect(() => {
    console.log("[useEffect] token:", token ? token.slice(0, 8) + "..." : null, "backendArtistId:", backendArtistId, "profileFetchTried:", profileFetchTried, "profileMissingBackendArtistId:", profileMissingBackendArtistId);
    if (!token) return;
    if (!profileFetchTried) return;
    if (!backendArtistId && profileMissingBackendArtistId) {
      ensureAndSyncArtistId().then(() => {
        // nach dem Sync neu laden (falls vorher leer)
        fetchAvailability();
      });
    }
    // Ergänzung: fetchAvailability immer nach Laden der backendArtistId aufrufen
    if (backendArtistId) {
      fetchAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, backendArtistId, profileFetchTried, profileMissingBackendArtistId]);

  const fetchAvailability = async () => {
    if (!token) return;
    console.log('fetchAvailability for artist', backendArtistId);
    setLoading(true);
    setError(null);
    try {
      const url = backendArtistId
        ? `${import.meta.env.VITE_API_URL}/api/availability?artist_id=${backendArtistId}`
        : `${import.meta.env.VITE_API_URL}/api/availability`;
      console.log('[fetchAvailability] Fetching from URL:', url, 'token (prefix):', token.slice(0, 8) + '...', 'backendArtistId:', backendArtistId);
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
        data.map(d => formatISODate(toLocalDate(d.date)))
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
    // avoid duplicate/concurrent requests for the same date
    if (inFlightAdd.current.has(iso)) return;
    // Robust: prüfe, ob available existiert
    if (!Array.isArray(available) ? false : (available ?? []).some((s) => s.date === iso)) return; // schon vorhanden

    // Optimistischer Eintrag (temporär)
    const tempSlot: AvailabilitySlot = { id: -Date.now(), date: iso };
    setAvailable((prev) => [...(prev ?? []), tempSlot]);
    inFlightAdd.current.add(iso);
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
        setAvailable((prev) => (prev ?? []).filter((s) => s.id !== tempSlot.id));
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
        const withoutTemp = (prev ?? []).filter((s) => s.id !== tempSlot.id && s.date !== iso);
        return [...withoutTemp, newSlot];
      });
    } catch (err: any) {
      console.error("addAvailability error", err);
      setError("Verfügbarkeit konnte nicht hinzugefügt werden.");
      // rollback optimistic insert if necessary
      setAvailable((prev) => (prev ?? []).filter((s) => s.date !== iso && s.id !== tempSlot.id));
    } finally {
      inFlightAdd.current.delete(iso);
    }
  };

  const removeAvailability = async (slot: AvailabilitySlot) => {
    if (!token) return;
    // Robust: prüfe, ob available existiert
    setAvailable((prev) => (prev ?? []).filter((s) => s.id !== slot.id));
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
      // Fange Netzwerkfehler besser ab, inkl. evtl. response text
      let message = "Verfügbarkeit konnte nicht entfernt werden.";
      if (err && err.message) message += " " + err.message;
      setError(message);
      // im Fehlerfall zurückrollen
      setAvailable((prev) => [...(prev ?? []), slot]);
    }
  };

  // Stelle sicher, dass der Tag heute+365 existiert (ein stabiler „Grenzmarker“)
  useEffect(() => {
    if (!token) return;
    if (loadingArtistId) return;

    const oneYearAhead = new Date(startOfToday);
    oneYearAhead.setDate(oneYearAhead.getDate() + 365);
    const iso = formatISODate(oneYearAhead);

    if (lastEnsuredIsoRef.current === iso) return;

    const exists = (available ?? []).some((s) => s.date === iso);
    if (exists) {
      lastEnsuredIsoRef.current = iso;
      return;
    }

    console.log('🟢 Auto-Availability: adding', iso, 'for artist', backendArtistId ?? '(current user)');
    lastEnsuredIsoRef.current = iso;
    (async () => {
      try {
        try {
          await addAvailability(oneYearAhead);
        } catch (e) {
          // Fehler pro Add-Aufruf abfangen
          console.warn('Auto-Availability failed for', iso, e);
          lastEnsuredIsoRef.current = null;
        }
      } catch (e) {
        // catch block für den outer try
        console.warn('Auto-Availability outer error for', iso, e);
        lastEnsuredIsoRef.current = null;
      }
    })();
  }, [token, loadingArtistId, startOfToday, available, backendArtistId]);

  // (removed effect that ensured all days from today to today+365 as available)

  // helper to check if date is available
  const isAvailable = (date: Date) => {
    const iso = formatISODate(date);
    return (available ?? []).some((s) => s.date === iso);
  };

 const handleDayClick = async (date: Date | undefined, _: any, event?: React.MouseEvent) => {
  if (event) event.preventDefault();
  if (!date) return;
  // Ignore past dates entirely
  if (date < startOfToday) return;
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
      const already = (available ?? []).some((s) => s.date === iso);
      if (already) {
        const slot = (available ?? []).find((s) => s.date === iso);
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
    <div className="max-w-5xl mx-auto p-6">
      <div className="mx-auto w-full max-w-[28rem] md:max-w-[36rem]">
        <h1 className="text-2xl font-bold mb-4 text-white">Buchungskalender</h1>
        <Accordion type="single" collapsible className="mb-5 rounded-md border border-white/40 bg-transparent">
          <AccordionItem value="guide">
            <AccordionTrigger className="px-4 text-white">Kurz erklärt</AccordionTrigger>
            <AccordionContent className="px-4 pb-4 leading-relaxed text-white">
              <p className="mb-2">
                Nach deinem Login setzen wir automatisch <strong>365 Tage</strong> auf <span className="text-green-400 font-medium">verfügbar</span>. Außerdem rutscht jeden Tag der Zeitraum um einen Tag nach vorn – so bleibt immer ein Jahr im Voraus verfügbar.
              </p>
              <p className="mb-2">
                <strong>Tag blockieren:</strong> Klicke auf einen Tag, um ihn auf <span className="text-red-400 font-medium">nicht verfügbar</span> zu setzen. Wähle zwei Daten, um einen ganzen Zeitraum zu markieren.
              </p>
              <p className="mb-0">
                <strong>Zurück auf verfügbar:</strong> Wenn du einen rot markierten Tag wieder aktivierst, wird er direkt gespeichert. Die <span className="text-green-400 font-medium">grüne</span> Hervorhebung siehst du ggf. erst nach einem kurzen Seiten-Refresh oder wenn du zwischen den Menüpunkten wechselst.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
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
      <div className="mx-auto w-full max-w-[28rem] md:max-w-[36rem] text-sm mb-4 flex items-center justify-center gap-6 text-white">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500/90" />
          <span>Verfügbar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500/80" />
          <span>Nicht verfügbar</span>
        </div>
      </div>
      {/* Range actions — now shown above the calendar for better visibility */}
      <div className="mx-auto w-full max-w-[28rem] md:max-w-[36rem]">
        {rangeStart && !rangeEnd && (
          <div className="mb-3 p-3 border border-white/30 rounded bg-transparent text-white flex items-center justify-between gap-2">
            <div><strong>Enddatum wählen.</strong></div>
            <button
              className="underline text-sm"
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
            const availableInRange = isoRange.filter(d => (available ?? []).some(s => s.date === d));
            const allAvailable = availableInRange.length === isoRange.length;
            const noneAvailable = availableInRange.length === 0;
            const title = `${rangeStart.toLocaleDateString()} bis ${rangeEnd.toLocaleDateString()}`;
            return (
              <div className="mb-3 p-3 border border-white/30 rounded bg-transparent text-white flex flex-col gap-2">
                <div>Ausgewählter Zeitraum: <strong>{title}</strong></div>
                <div className="flex flex-wrap gap-2 items-center">
                  {allAvailable && (
                    <button
                      className="px-3 py-1 bg-red-600 rounded"
                      disabled={processingRange}
                      onClick={async () => {
                        setProcessingRange(true);
                        try {
                          for (const iso of isoRange) {
                            const slot = (available ?? []).find(s => s.date === iso);
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
                          for (const iso of isoRange) {
                            await addAvailability(toLocalDate(iso) as Date);
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
                              if (!(available ?? []).some(s => s.date === iso)) {
                                await addAvailability(toLocalDate(iso) as Date);
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
                              const slot = (available ?? []).find(s => s.date === iso);
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
      <div className="w-full flex justify-center">
        <Calendar
          mode="multiple"
          numberOfMonths={1}
          onDayClick={handleDayClick as any}
          modifiers={modifiers}
          disabled={disabledDays}
          initialFocus
          className="mx-auto w-full max-w-[28rem] md:max-w-[36rem] [--cell-size:2.25rem] md:[--cell-size:2.75rem] lg:[--cell-size:3rem]"
        />
      </div>
      {/* Range panel moved above the calendar */}
      {error && error.startsWith("Fehler beim Laden: 500") && (
        <div className="mt-2 text-sm text-yellow-700">
          Wenn weiterhin 500 kommt: Backend-Logs checken oder Token prüfen.
        </div>
      )}
    </div>
  );
};

export default CalendarPage;