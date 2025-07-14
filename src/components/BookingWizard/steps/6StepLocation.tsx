import React from 'react';
import type { BookingData } from '../types';

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
      <h2>Veranstaltungsort</h2>
      <div className="input-group" style={{ margin: '16px 0' }}>
        <label htmlFor="address">Adresse:</label>
        <input
          id="address"
          type="text"
          value={data.event_address}
          onChange={handleAddressChange}
          placeholder="Straße, Stadt, PLZ"
          style={{ marginLeft: '8px', width: '60%' }}
        />
      </div>
      <div className="options" style={{ margin: '16px 0' }}>
        <span>Ort:</span>
        <label style={{ display: 'block', margin: '8px 0' }}>
          <input
            type="radio"
            name="is_indoor"
            value="true"
            checked={data.is_indoor === true}
            onChange={handleIndoorChange}
          />
          <span style={{ marginLeft: '8px' }}>Indoor</span>
        </label>
        <label style={{ display: 'block', margin: '8px 0' }}>
          <input
            type="radio"
            name="is_indoor"
            value="false"
            checked={data.is_indoor === false}
            onChange={handleIndoorChange}
          />
          <span style={{ marginLeft: '8px' }}>Outdoor</span>
        </label>
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
