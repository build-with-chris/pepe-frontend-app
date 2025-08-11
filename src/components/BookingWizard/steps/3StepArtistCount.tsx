

import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';

export interface StepArtistCountProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepArtistCount: React.FC<StepArtistCountProps> = ({
  data,
  onChange,
  onNext,
  onPrev
}) => {
  const options: { label: string; value: number }[] = [
    { label: 'Solo', value: 1 },
    { label: 'Duo', value: 2 },
    { label: 'Gruppe', value: 3 }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ team_size: Number(e.target.value) });
  };

  return (
    <div className="step">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Wie viele Artists möchtest du buchen?</h2>
      <div className="w-full max-w-2xl mx-auto bg-gray-100 text-gray-700 rounded-lg p-3 mb-6">
        <p className="text-sm leading-relaxed text-center">
          <span className="font-semibold">Warum wir das fragen:&nbsp;</span>
          Die Anzahl der Künstler beeinflusst den Ablauf, die Showdynamik und den Preis. So können wir dir ein passendes Angebot kalkulieren.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full lg:w-2/3 mx-auto">
        {options.map(option => (
          <OptionCard
            key={option.value}
            name="team_size"
            value={option.value.toString()}
            label={option.label}
            imgSrc={`/images/teamSizes/${option.label.replace(/ /g, '_')}.webp`}
            checked={data.team_size === option.value}
            onChange={val => { onChange({ team_size: Number(val) }); onNext(); }}
          />
        ))}
      </div>
      
    </div>
  );
};

export default StepArtistCount;