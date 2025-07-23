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
      <h2 className="text-4xl font-bold text-center my-4">Wünsche & Sonderwünsche</h2>
      <div className="w-full lg:w-2/3 mx-auto mb-6">
        <label htmlFor="wishes" className="block text-sm font-medium text-white-100">
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
      <div className="flex flex-wrap justify-center items-center gap-6 w-full lg:w-2/3 mx-auto mb-6">
        {[
          { key: 'light', label: 'Licht benötigt', field: 'needs_light', checked: data.needs_light },
          { key: 'sound', label: 'Musikanlage benötigt', field: 'needs_sound', checked: data.needs_sound },
        ].map(option => (
          <label key={option.key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => onChange({ [option.field]: !option.checked } as any)}
              className="h-6 w-6 text-blue-600 border border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-white-700 font-medium">{option.label}</span>
          </label>
        ))}
      </div>
      
    </div>
  );
};

export default StepWishes;