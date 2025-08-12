import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import type { BookingData } from '../types';

export interface StepDateAndTimeProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepDateAndTime: React.FC<StepDateAndTimeProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  // Helper: turn Date -> 'YYYY-MM-DD'
  const toISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Calendar selection handler
  const handleCalendarSelect = (selected?: Date) => {
    if (!selected) return;
    onChange({ event_date: toISODate(selected) });
  };

  // Time slot builder (12:00 -> 24:00 in 30-min steps, last slot 23:30)
  const timeSlots = React.useMemo(() => {
    // 12 hours * 2 slots/hour = 24 slots (12:00, 12:30, ..., 23:30)
    return Array.from({ length: 24 }, (_, i) => {
      const totalMinutes = i * 30; // 0 .. 690
      const hour = Math.floor(totalMinutes / 60) + 12; // start 12:00
      const minute = totalMinutes % 60;
      return `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
    });
  }, []);

  // Selected time comes from data.event_time
  const selectedTime = data.event_time || null;

  // Optional: disable past days
  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  // Compute defaultMonth and selected Date from stored string
  const selectedDate = React.useMemo(() => {
    if (!data.event_date) return undefined;
    const [y, m, d] = data.event_date.split('-').map((v) => parseInt(v, 10));
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  }, [data.event_date]);

  return (
    <div className="step flex flex-col items-center pb-28">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Wann findet deine Veranstaltung statt?</h2>

      <div className="w-full max-w-2xl mx-auto bg-gray-100 text-gray-700 rounded-lg p-3 mb-6">
        <p className="text-sm leading-relaxed text-center">
          <span className="font-semibold">Warum wir das fragen:&nbsp;</span>
          Datum und Uhrzeit helfen uns, die Verfügbarkeit der Künstler zu prüfen und die Planung optimal auf dein Event abzustimmen. Die ungefähre Gästeanzahl reicht vollkommen aus – so können wir besser einschätzen, welche Effekte und Showelemente am besten wirken.
        </p>
      </div>

      {/* Calendar + Time slots */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:[grid-template-columns:1fr_220px_220px] gap-4 md:gap-6 mb-6 items-stretch">
        <div className="flex flex-col items-center rounded-lg border border-white/10 bg-white/5 p-3 md:p-4 min-w-0">
          <div className="flex items-center gap-2 mb-3 text-white">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-base md:text-lg font-semibold tracking-wide">Datum wählen</span>
          </div>
          <div className="h-px bg-white/10 -mt-2 mb-3" />
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleCalendarSelect}
            defaultMonth={selectedDate || new Date()}
            disabled={isPast}
            showOutsideDays={false}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) =>
                date.toLocaleString('de-DE', { weekday: 'short' }),
            }}
          />
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-3 md:p-4 max-h-[500px] overflow-y-auto no-scrollbar min-w-0 flex flex-col">
          <div className="mb-3 text-white text-base md:text-lg font-semibold tracking-wide">Uhrzeit wählen</div>
          <div className="h-px bg-white/10 -mt-2 mb-3" />
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? 'secondary' : 'default'}
                onClick={() => onChange({ event_time: time })}
                className="w-full shadow-none"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 md:p-4 min-w-0">
          <div className="mb-3 text-white text-base md:text-lg font-semibold tracking-wide">Gäste</div>
          <div className="h-px bg-white/10 -mt-2 mb-3" />
          <div className="grid gap-2">
            {[
              { label: 'Unter 200', value: 199 },
              { label: '200 - 500', value: 350 },
              { label: 'Über 500', value: 501 },
            ].map((option) => (
              <Button
                key={option.label}
                onClick={() => onChange({ number_of_guests: option.value })}
                variant={data.number_of_guests === option.value ? 'secondary' : 'default'}
                className="w-full"
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-neutral-200 mb-4">
        {data.event_date && data.event_time ? (
          <>
            Dein Termin: <span className="font-medium">{new Date(data.event_date).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</span> um{' '}
            <span className="font-medium">{data.event_time}</span> Uhr.
          </>
        ) : (
          <>Bitte wähle ein Datum und eine Uhrzeit.</>
        )}
      </div>

      {/* Fixed footer CTA */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-4 bg-black/60 backdrop-blur-sm flex justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="bg-white/10 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-white/20"
        >
          Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!data.event_date || !data.event_time || !data.number_of_guests}
          className={`bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-opacity ${
            !data.event_date || !data.event_time || !data.number_of_guests
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700'
          }`}
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepDateAndTime;