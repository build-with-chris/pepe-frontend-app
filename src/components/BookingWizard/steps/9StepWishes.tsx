import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';

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
    <div className="step flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mt-4">Wünsche & Sonderwünsche</h2>
      <div className="w-2/3 mx-auto mb-6">
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
      <div className="grid grid-cols-2 gap-4 w-2/3 mx-auto mb-6">
        <OptionCard
          name="needs_light"
          value="true"
          label="Licht benötigt"
          imgSrc="/images/needs_light.png"
          checked={data.needs_light}
          onChange={val => onChange({ needs_light: val === 'true' })}
        />
        <OptionCard
          name="needs_sound"
          value="true"
          label="Ton/Musikanlage benötigt"
          imgSrc="/images/needs_sound.png"
          checked={data.needs_sound}
          onChange={val => onChange({ needs_sound: val === 'true' })}
        />
      </div>
      <div className="flex justify-between w-2/3 mb-6">
        <button
          type="button"
          onClick={onPrev}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepWishes;