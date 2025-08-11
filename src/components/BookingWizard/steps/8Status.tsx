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
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Wie ist dein aktueller Planungsstatus?</h2>
      <div className="w-full max-w-2xl mx-auto bg-gray-100 text-gray-700 rounded-lg p-3 mb-6">
        <p className="text-sm leading-relaxed text-center">
          <span className="font-semibold">Warum wir das fragen:&nbsp;</span>
          Dein Planungsstatus hilft uns, die Dringlichkeit und Detailtiefe unserer Vorschläge anzupassen – ob du noch in der Ideenphase bist oder schon fast buchen möchtest.
        </p>
      </div>

      <div className="flex flex-col space-y-2 w-full max-w-xs">
        {statusOptionsList.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange({ planning_status: option.value });
              onNext();
            }}
            className={`w-full py-2 px-4 rounded-md border transition-colors duration-150 ${
              data.planning_status === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      
    </div>
  );
};

export default StepNumberGuestsAndStatus;
