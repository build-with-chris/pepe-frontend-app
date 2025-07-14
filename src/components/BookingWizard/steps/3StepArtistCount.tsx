

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
      <h2>Anzahl der Artists</h2>
      <div className="grid grid-cols-3 gap-4 w-full">
        {options.map(option => (
          <OptionCard
            key={option.value}
            name="team_size"
            value={option.value.toString()}
            label={option.label}
            imgSrc={`/images/teamSizes/${option.label.replace(/ /g, '_')}.png`}
            checked={data.team_size === option.value}
            onChange={val => { onChange({ team_size: Number(val) }); onNext(); }}
          />
        ))}
      </div>
      <div className="navigation">
        <button type="button" onClick={onPrev}>
          Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={![1, 2, 3].includes(data.team_size)}
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepArtistCount;