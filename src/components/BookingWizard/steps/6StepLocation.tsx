import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';

export interface StepLocationProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepLocation: React.FC<StepLocationProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ event_address: e.target.value });
  };

  const handleIndoorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ is_indoor: e.target.value === 'true' });
  };

  return (
    <div className="step">
      <h2 className='text-3xl text-center font-mono font-black'>Veranstaltungsort</h2>
      <div className="w-2/3 mx-auto mb-6">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Adresse
        </label>
        <input
          id="address"
          type="text"
          value={data.event_address}
          onChange={handleAddressChange}
          placeholder="Straße, Stadt, PLZ"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 w-2/3 mx-auto mb-6">
        <OptionCard
          name="is_indoor"
          value="true"
          label="Indoor"
          imgSrc="/images/indoor.png"
          checked={data.is_indoor === true}
          onChange={val => { onChange({ is_indoor: val === 'true' }); onNext(); }}
        />
        <OptionCard
          name="is_indoor"
          value="false"
          label="Outdoor"
          imgSrc="/images/outdoor.png"
          checked={data.is_indoor === false}
          onChange={val => { onChange({ is_indoor: val === 'true' }); onNext(); }}
        />
      </div>
      <div className="navigation">
        <button type="button" onClick={onPrev}>
          Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!data.event_address}
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepLocation;
