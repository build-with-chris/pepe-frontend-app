import React from 'react';
import type { BookingData } from '../types';

export interface StepNumberGuestsAndStatusProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepNumberGuestsAndStatus: React.FC<StepNumberGuestsAndStatusProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const statusOptions: { label: string; value: string }[] = [
    { label: 'Erstplanung', value: 'Erstplanung' },
    { label: 'Angebotsvergleich', value: 'Angebotsvergleich' },
    { label: 'Bereit zum Buchen', value: 'Bereit zum Buchen' },
    { label: 'Schneller Bedarf', value: 'Schneller Bedarf' },
  ];

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onChange({ number_of_guests: isNaN(value) ? 0 : value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ planning_status: e.target.value });
  };

  return (
    <div className="step">
      <h2>Gäste & Planungsstatus</h2>
      <div className="input-group" style={{ margin: '16px 0' }}>
        <label htmlFor="guests">Anzahl der Gäste:</label>
        <input
          id="guests"
          type="number"
          min={1}
          value={data.number_of_guests}
          onChange={handleGuestsChange}
          style={{ marginLeft: '8px', width: '60px' }}
        />
      </div>
      <div className="options" style={{ margin: '16px 0' }}>
        <span>Planungsstatus:</span>
        {statusOptions.map(option => (
          <label key={option.value} style={{ display: 'block', margin: '8px 0' }}>
            <input
              type="radio"
              name="planning_status"
              value={option.value}
              checked={data.planning_status === option.value}
              onChange={handleStatusChange}
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
          disabled={data.number_of_guests < 1 || !data.planning_status}
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepNumberGuestsAndStatus;
