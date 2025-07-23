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
    <div className="p-0 w-full mx-auto md:max-w-4/5 flex flex-col items-center">
      <h2 className="text-4xl font-bold text-center mb-6">Planungsstatus</h2>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-4 w-full">
        {statusOptionsList.map(option => (
          <div
            key={option.value}
            onClick={() => {
              onChange({ planning_status: option.value });
              onNext();
            }}
            className={`w-full aspect-square flex items-center justify-center p-4 border rounded-lg cursor-pointer ${
              data.planning_status === option.value
                ? 'bg-blue-800 border-2 border-blue-400 text-white text-xl'
                : 'bg-gray-800 border-2 border-gray-600 text-gray-300 hover:bg-gray-700 text-xl'
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
