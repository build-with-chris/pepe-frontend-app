import React, { useState, useEffect } from 'react';
import type { BookingData } from '../types';
import { Button } from '../../ui/button';
import InfoBox from '../Infobox';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export interface StepLengthOfShowProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepLengthOfShow: React.FC<StepLengthOfShowProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const [customMode, setCustomMode] = useState(false);
  useEffect(() => {
    if (!customMode) return;
    const minutes = data.duration_minutes;
    if (typeof minutes === 'number' && minutes >= 1) {
      const t = setTimeout(() => {
        onNext();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [customMode, data.duration_minutes, onNext]);

  // Ensure a default duration is set if none selected yet (preselect 5 minutes)
  useEffect(() => {
    if (!customMode && (!data.duration_minutes || data.duration_minutes < 1)) {
      onChange({ duration_minutes: 5 });
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onChange({ duration_minutes: isNaN(value) ? 0 : value });
  };

  return (
    <div className="step pb-28">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Wie lange soll die Show dauern?</h2>
      <div className="input-group w-2/3 md:w-2/5 mx-auto flex flex-col items-center justify-center my-4">
        <label htmlFor="durationSelect" className="block w-full text-center text-sm font-medium text-black mb-2">
          Dauer auswählen:
        </label>
        <select
          id="durationSelect"
          value={customMode ? 'custom' : (data.duration_minutes && data.duration_minutes > 0 ? data.duration_minutes.toString() : '5')}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'custom') {
              setCustomMode(true);
            } else {
              const minutes = parseInt(val, 10);
              setCustomMode(false);
              onChange({ duration_minutes: isNaN(minutes) ? 0 : minutes });
              // Always advance, even if minutes didn't change
              onNext();
            }
          }}
          className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        >
          <option value="5">5 Minuten</option>
          <option value="10">10 Minuten</option>
          <option value="15">15 Minuten</option>
          {data.team_size !== 1 && (
            <option value="20">20 Minuten</option>
          )}
          <option value="custom">Andere...</option>
        </select>
        {customMode && (
          <>
            <input
              type="number"
              min={1}
              value={data.duration_minutes || ''}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                onChange({ duration_minutes: isNaN(v) ? 0 : v });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = parseInt((e.target as HTMLInputElement).value, 10);
                  if (!isNaN(v) && v >= 1) onNext();
                }
              }}
              placeholder="Minuten"
              className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <Button
              variant="default"
              onClick={onNext}
              disabled={data.duration_minutes < 1}
              className="mt-4"
            >
              Weiter
            </Button>
          </>
        )}
      </div>
      {/* Erklärung – Desktop & Tablet */}
      <div className="hidden md:block w-full md:w-3/5 lg:w-2/5 mx-auto mt-3">
        <InfoBox
          title="Warum wir das fragen"
          text={
            <>Die Showdauer beeinflusst Dramaturgie, Energielevel und Preis. So können wir dir einen Ablauf empfehlen, der perfekt zu deinem Event passt.</>
          }
        />
      </div>

      {/* Erklärung – Mobile: nur Accordion */}
      <div className="md:hidden w-full md:w-3/5 lg:w-2/5 mx-auto mt-3">
        <Accordion type="single" collapsible>
          <AccordionItem value="why-length">
            <AccordionTrigger>
              Warum wir nach der Showdauer fragen
            </AccordionTrigger>
            <AccordionContent>
              Die Showdauer beeinflusst Dramaturgie, Energielevel und Preis. So können wir dir einen Ablauf empfehlen, der perfekt zu deinem Event passt.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {/* Fixed footer CTA */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-4 bg-black/60 backdrop-blur-sm flex justify-center">
        <Button
          variant="default"
          onClick={onNext}
          disabled={!data.duration_minutes || data.duration_minutes < 1}
          className={`text-white font-semibold py-3 px-8 rounded-full shadow-lg ${(!data.duration_minutes || data.duration_minutes < 1) ? 'bg-blue-600/60 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default StepLengthOfShow;