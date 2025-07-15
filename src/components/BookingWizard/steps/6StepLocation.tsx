import React, { useState } from 'react';
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
  // Separate address fields: Straße, PLZ, Stadt
  const [street, setStreet] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [hasSelection, setHasSelection] = useState(false);

  // Combine into single event_address on change
  const updateAddress = (newStreet: string, newPostalCode: string, newCity: string) => {
    const addr = `${newStreet}${newPostalCode ? ', ' + newPostalCode : ''}${newCity ? ' ' + newCity : ''}`.trim();
    onChange({ event_address: addr });
  };

  const handleIndoorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ is_indoor: e.target.value === 'true' });
  };

  return (
    <div className="step">
      <h2 className='text-4xl text-center font-mono font-black'>Veranstaltungsort</h2>
      <div className="w-full lg:w-2/3 mx-auto mb-4">
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
          Straße
        </label>
        <input
          id="street"
          type="text"
          value={street}
          onChange={e => { const v = e.target.value; setStreet(v); updateAddress(v, postalCode, city); }}
          placeholder="Musterstraße 1"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full lg:w-2/3 mx-auto mb-4">
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
          PLZ
        </label>
        <input
          id="postalCode"
          type="text"
          value={postalCode}
          onChange={e => { const v = e.target.value; setPostalCode(v); updateAddress(street, v, city); }}
          placeholder="12345"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full lg:w-2/3 mx-auto mb-6">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          Stadt <span className="text-red-500">*</span>
        </label>
        <input
          id="city"
          type="text"
          required
          value={city}
          onChange={e => { const v = e.target.value; setCity(v); updateAddress(street, postalCode, v); }}
          placeholder="Musterstadt"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 w-full lg:w-2/3 mx-auto mb-6">
        <OptionCard
          name="is_indoor"
          value="true"
          label="Indoor"
          imgSrc="/images/indoor.png"
          checked={hasSelection && data.is_indoor === true}
          onChange={val => {
            setHasSelection(true);
            onChange({ is_indoor: val === 'true' });
            if (street && postalCode && city) {
              onNext();
            }
          }}
        />
        <OptionCard
          name="is_indoor"
          value="false"
          label="Outdoor"
          imgSrc="/images/outdoor.png"
          checked={hasSelection && data.is_indoor === false}
          onChange={val => {
            setHasSelection(true);
            onChange({ is_indoor: val === 'true' });
            if (street && postalCode && city) {
              onNext();
            }
          }}
        />
      </div>
    </div>
  );
};

export default StepLocation;
