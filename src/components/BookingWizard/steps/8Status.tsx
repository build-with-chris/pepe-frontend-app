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
  const statusOptionsList = [
    { value: 'Erstplanung', label: 'Erstplanung' },
    { value: 'Angebotsvergleich', label: 'Angebotsvergleich' },
    { value: 'Bereit zum Buchen', label: 'Bereit zum Buchen' },
    { value: 'Schneller Bedarf', label: 'Schneller Bedarf' },
  ];

  return (
    <div className="step flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mb-6">Planungsstatus</h2>

      <div className="grid grid-cols-2 gap-4 w-1/3 mb-8 mx-auto">
        {statusOptionsList.map(option => (
          <div
            key={option.value}
            onClick={() => {
              onChange({ planning_status: option.value });
              onNext();
            }}
            className={`w-full aspect-square flex items-center justify-center p-4 border rounded-lg cursor-pointer ${
              data.planning_status === option.value
                ? 'bg-gray-100 border-white text-black'
                : 'bg-gray-800 border-gray-600 text-white'
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default StepNumberGuestsAndStatus;
