

import React from 'react';
import type { BookingData } from '../types';

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onChange({ duration_minutes: isNaN(value) ? 0 : value });
  };

  return (
    <div className="step">
      <h2>Dauer der Einlage</h2>
      <div className="input-group" style={{ margin: '16px 0' }}>
        <label htmlFor="duration">Dauer in Minuten:</label>
        <input
          id="duration"
          type="number"
          min={1}
          value={data.duration_minutes}
          onChange={handleChange}
          placeholder="z.B. 30"
          style={{ marginLeft: '8px' }}
        />
      </div>
      <div className="navigation">
        <button type="button" onClick={onPrev}>
          Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={data.duration_minutes < 1}
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepLengthOfShow;