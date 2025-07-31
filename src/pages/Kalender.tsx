import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useAuth } from '@/context/AuthContext';

type AvailabilitySlot = { id: number; date: string }; // expecting YYYY-MM-DD

const CalendarPage: React.FC = () => {
  const { token } = useAuth();
  const [available, setAvailable] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/availability`, {
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
        body: JSON.stringify({ date: iso }),
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
    fetchAvailability();
  }, [token]);

  // helper to check if date is available
  const isAvailable = (date: Date) => {
    const iso = date.toISOString().split("T")[0];
    return available.some((s) => s.date === iso);
  };

  const handleDayClick = (date: Date | undefined) => {
    if (!date) return;
    setError(null);
    if (isAvailable(date)) {
      const iso = date.toISOString().split("T")[0];
      const slot = available.find((s) => s.date === iso)!;
      removeAvailability(slot);
    } else {
      addAvailability(date);
    }
  };

  // build modifiers for DayPicker
  const modifiers = {
    available: available.map((s) => new Date(s.date)),
  } as any;

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
      <DayPicker
        mode="single"
        selected={undefined}
        onDayClick={handleDayClick as any}
        modifiers={modifiers}
        modifiersClassNames={{ available: "bg-green-200 rounded" }}
        numberOfMonths={2}
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