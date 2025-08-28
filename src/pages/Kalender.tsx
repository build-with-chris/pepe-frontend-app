import React, { useState, useEffect, useMemo, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useAuth } from '@/context/AuthContext';
import { toLocalDate, formatISODate, getDateRange } from "@/utils/calendar";
import { listAvailability, createAvailability, deleteAvailability } from "@/services/availabilityApi";
import type { AvailabilitySlot, ISODate } from "@/services/availabilityApi";

function useBackendArtistId(user: any, token: string | null) {
  const [backendArtistId, setBackendArtistId] = useState<string | null>(null);
  const [loadingArtistId, setLoadingArtistId] = useState(true);

  const load = async () => {
    if (!token) { setLoadingArtistId(false); return; }
    setLoadingArtistId(true);
    try {
      // 1) Prefer the backend ensure endpoint
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/artists/me/ensure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.id) { setBackendArtistId(String(data.id)); return; }
      }
      // 2) Fallback: try listing and matching by email
      const email = user?.email;
      if (email) {
        const listRes = await fetch(`${import.meta.env.VITE_API_URL}/api/artists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (listRes.ok) {
          const artists = await listRes.json().catch(() => []);
          const match = Array.isArray(artists) ? artists.find((a: any) => a.email && a.email.toLowerCase() === String(email).toLowerCase()) : null;
          if (match?.id) { setBackendArtistId(String(match.id)); return; }
        }
      }
      setBackendArtistId(null);
    } catch (e) {
      console.warn('[useBackendArtistId] error resolving id from backend', e);
      setBackendArtistId(null);
    } finally {
      setLoadingArtistId(false);
    }
  };

  useEffect(() => { load(); }, [token, user?.email]);

  return { backendArtistId, loadingArtistId, refreshArtistId: load };
}


const CalendarPage: React.FC = () => {
  const { token, user } = useAuth();
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



  

  const { backendArtistId, loadingArtistId, refreshArtistId } =
    useBackendArtistId(user, token);

  const fetchAvailability = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listAvailability({ token, artistId: backendArtistId ?? undefined });
      setAvailable(data);
    } catch (err: any) {
      setError('Verfügbarkeit konnte nicht geladen werden.' + (err?.message ? ` ${err.message}` : ''));
    } finally {
      setLoading(false);
    }
  };

  const addAvailability = async (date: Date) => {
    if (!token) return;
    const iso = formatISODate(date) as ISODate;
    if ((available ?? []).some((s) => s.date === iso)) return;

    const tempSlot: AvailabilitySlot = { id: -Date.now(), date: iso };
    setAvailable((prev) => [...(prev ?? []), tempSlot]);
    try {
      const newSlot = await createAvailability({ token, date: iso, artistId: backendArtistId ?? undefined });
      setAvailable((prev) => {
        const withoutTemp = (prev ?? []).filter((s) => s.id !== tempSlot.id && s.date !== iso);
        return [...withoutTemp, newSlot];
      });
    } catch (err: any) {
      setError('Verfügbarkeit konnte nicht hinzugefügt werden.' + (err?.message ? ` ${err.message}` : ''));
      setAvailable((prev) => (prev ?? []).filter((s) => s.id !== tempSlot.id && s.date !== iso));
    }
  };

  const removeAvailability = async (slot: AvailabilitySlot) => {
    if (!token) return;
    setAvailable((prev) => (prev ?? []).filter((s) => s.id !== slot.id));
    try {
      await deleteAvailability({ token, slotId: slot.id, artistId: backendArtistId ?? undefined });
    } catch (err: any) {
      let message = 'Verfügbarkeit konnte nicht entfernt werden.';
      if (err && err.message) message += ' ' + err.message;
      setError(message);
      setAvailable((prev) => [...(prev ?? []), slot]);
    }
  };

  useEffect(() => {
    if (!token || !backendArtistId) return;
    fetchAvailability();
  }, [token, backendArtistId]);

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