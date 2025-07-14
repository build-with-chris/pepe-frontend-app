

import React from 'react';
import type { BookingData } from '../types';

export interface StepEventTypeProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepEventType: React.FC<StepEventTypeProps> = ({ data, onChange, onNext }) => {
  const options = ['Private Feier', 'Firmenfeier', 'Incentive', 'Streetshow'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ event_type: e.target.value });
  };

  return (
    <div className="step">
      <h2>Event Typ auswählen</h2>
      <div className="options">
        {options.map(option => (
          <label key={option} style={{ display: 'block', margin: '8px 0' }}>
            <input
              type="radio"
              name="event_type"
              value={option}
              checked={data.event_type === option}
              onChange={handleChange}
            />
            <span style={{ marginLeft: '8px' }}>{option}</span>
          </label>
        ))}
      </div>
      <div className="navigation">
        <button type="button" onClick={onNext} disabled={!data.event_type}>
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepEventType;