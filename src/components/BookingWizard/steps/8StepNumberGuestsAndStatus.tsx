import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';

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
      <div className="w-2/3 mx-auto mb-6">
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
          Anzahl der Gäste
        </label>
        <input
          id="guests"
          type="number"
          min={1}
          value={data.number_of_guests}
          onChange={handleGuestsChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col items-center w-full">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Planungsstatus</h3>
        <div className="grid grid-cols-2 gap-4 w-2/3 mx-auto">
          {statusOptions.map(option => (
            <OptionCard
              key={option.value}
              name="planning_status"
              value={option.value}
              label={option.label}
              imgSrc={`/images/status/${option.value.replace(/ /g, '_')}.png`}
              checked={data.planning_status === option.value}
              onChange={val => { onChange({ planning_status: val }); onNext(); }}
            />
          ))}
        </div>
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
