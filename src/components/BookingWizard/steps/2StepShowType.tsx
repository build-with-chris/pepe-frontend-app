import React from 'react';
import type { BookingData } from '../types';

export interface StepShowTypeProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepShowType: React.FC<StepShowTypeProps> = ({ data, onChange, onNext, onPrev }) => {
  const options = ['Walking Act', 'Bühnen Show'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ show_type: e.target.value });
  };

  return (
    <div className="step">
      <h2>Show-Typ auswählen</h2>
      <div className="options">
        {options.map(option => (
          <label key={option} style={{ display: 'block', margin: '8px 0' }}>
            <input
              type="radio"
              name="show_type"
              value={option}
              checked={data.show_type === option}
              onChange={handleChange}
            />
            <span style={{ marginLeft: '8px' }}>{option}</span>
          </label>
        ))}
      </div>
      <div className="navigation">
        <button type="button" onClick={onPrev}>
          Zurück
        </button>
        <button type="button" onClick={onNext} disabled={!data.show_type}>
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepShowType;
