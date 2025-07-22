import React from 'react';
import type { BookingData } from '../types';

export interface StepWishesProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepWishes: React.FC<StepWishesProps> = ({ data, onChange, onNext, onPrev }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ special_requests: e.target.value });
  };

  return (
    <div className="w-full step flex flex-col items-center">
      <h2 className="text-4xl font-bold text-center mt-4">Wünsche & Sonderwünsche</h2>
      <div className="w-full lg:w-2/3 mx-auto mb-6">
        <label htmlFor="wishes" className="block text-sm font-medium text-gray-700">
          Hier kannst du deine Wünsche eintragen:
        </label>
        <textarea
          id="wishes"
          value={data.special_requests}
          onChange={handleChange}
          placeholder="z.B. besondere Lichtwünsche, Story-Elemente, Überraschungsmomente"
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-around items-center gap-6 w-full lg:w-2/3 mx-auto mb-6">
        {[
          { key: 'light', label: 'Licht benötigt', field: 'needs_light', checked: data.needs_light },
          { key: 'sound', label: 'Musikanlage benötigt', field: 'needs_sound', checked: data.needs_sound },
        ].map(option => (
          <div
            key={option.key}
            onClick={() => onChange({ [option.field]: !option.checked } as any)}
            className={`w-full max-w-[300px] max-h-[300px] aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-colors
              ${option.checked
                ? 'bg-blue-600 border-2 border-blue-400 text-white text-2xl'
                : 'bg-gray-800 border-2 border-gray-600 text-gray-300 hover:bg-gray-700 text-2xl'
              }`}
          >
            <span className="font-medium">{option.label}</span>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default StepWishes;