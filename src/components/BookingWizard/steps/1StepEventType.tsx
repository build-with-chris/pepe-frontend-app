import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';

export interface StepEventTypeProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepEventType: React.FC<StepEventTypeProps> = ({ data, onChange, onNext }) => {
  const options = [
    { value: 'Private Feier', label: 'Private Feier', img: 'Private_Feier' },
    { value: 'Firmenfeier', label: 'Firmenfeier', img: 'Firmenfeier' },
    { value: 'Incentive', label: 'Teamevent', img: 'Incentive' },
    { value: 'Streetshow', label: 'Streetshow', img: 'Streetshow' },
  ];

  return (
    <div className="p-0 w-full mx-auto md:max-w-4/5">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Welchen Event‑Typ planst du?</h2>
      <div className="w-full max-w-2xl mx-auto bg-gray-200 text-gray-800 rounded-lg p-3 mb-6">
        <p className="text-sm leading-relaxed text-center">
          <span className="font-semibold">Warum wir das fragen:&nbsp;</span>
          Damit wir dir die passendsten Künstler vorschlagen können – mit Referenzen, die zu deinem Event passen.
        </p>
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 w-full">
        {options.map(option => (
          <OptionCard
            key={option.value}
            name="event_type"
            value={option.value}
            label={option.label}
            imgSrc={`/images/eventTypes/${option.img}.webp`}
            checked={data.event_type === option.value}
            onChange={val => onChange({ event_type: val })}
            onSelectNext={onNext}
          />
        ))}
      </div>
    </div>
  );
};

export default StepEventType;