

import React from 'react';
import type { BookingData } from '../types';

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
      <div className="options">
        {options.map(option => (
          <label key={option.value} style={{ display: 'block', margin: '8px 0' }}>
            <input
              type="radio"
              name="team_size"
              value={option.value}
              checked={data.team_size === option.value}
              onChange={handleChange}
            />
            <span style={{ marginLeft: '8px' }}>{option.label}</span>
          </label>
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