

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
    <div className="step">
      <h2>Wünsche & Sonderwünsche</h2>
      <div className="input-group" style={{ margin: '16px 0' }}>
        <label htmlFor="wishes">Hier kannst du deine Wünsche eintragen:</label>
        <textarea
          id="wishes"
          value={data.special_requests}
          onChange={handleChange}
          placeholder="z.B. besondere Lichtwünsche, Story-Elemente, Überraschungsmomente"
          rows={4}
          style={{ marginTop: '8px', width: '100%', padding: '8px' }}
        />
      </div>
      <div className="options" style={{ margin: '16px 0' }}>
        <label style={{ display: 'block', margin: '8px 0' }}>
          <input
            type="checkbox"
            checked={data.needs_light}
            onChange={e => onChange({ needs_light: e.target.checked })}
          />
          <span style={{ marginLeft: '8px' }}>Licht benötigt</span>
        </label>
        <label style={{ display: 'block', margin: '8px 0' }}>
          <input
            type="checkbox"
            checked={data.needs_sound}
            onChange={e => onChange({ needs_sound: e.target.checked })}
          />
          <span style={{ marginLeft: '8px' }}>Ton/Musikanlage benötigt</span>
        </label>
      </div>
      <div className="navigation">
        <button type="button" onClick={onPrev}>
          Zurück
        </button>
        <button type="button" onClick={onNext}>
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepWishes;