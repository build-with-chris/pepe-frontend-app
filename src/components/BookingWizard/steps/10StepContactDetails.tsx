

import React from 'react';
import type { BookingData } from '../types';

export interface StepContactDetailsProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepContactDetails: React.FC<StepContactDetailsProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ client_name: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ client_email: e.target.value });
  };

  const handleNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ newsletter_opt_in: e.target.checked });
  };

  const isValidEmail = (email: string) => {
    // simple email regex
    return /\S+@\S+\.\S+/.test(email);
  };

  const canProceed =
    data.client_name.trim().length > 0 && isValidEmail(data.client_email);

  return (
    <div className="step">
      <h2>Kontakt & Rabatt</h2>
      <div className="input-group" style={{ margin: '16px 0' }}>
        <label htmlFor="clientName">Name:</label>
        <input
          id="clientName"
          type="text"
          value={data.client_name}
          onChange={handleNameChange}
          placeholder="Dein Name"
          style={{ marginLeft: '8px', width: '60%' }}
        />
      </div>
      <div className="input-group" style={{ margin: '16px 0' }}>
        <label htmlFor="clientEmail">E-Mail:</label>
        <input
          id="clientEmail"
          type="email"
          value={data.client_email}
          onChange={handleEmailChange}
          placeholder="name@beispiel.de"
          style={{ marginLeft: '8px', width: '60%' }}
        />
      </div>
      <div className="options" style={{ margin: '16px 0' }}>
        <label style={{ display: 'block', margin: '8px 0' }}>
          <input
            type="checkbox"
            checked={data.newsletter_opt_in}
            onChange={handleNewsletterChange}
          />
          <span style={{ marginLeft: '8px' }}>
            Newsletter abonnieren (5% Rabatt)
          </span>
        </label>
      </div>
      <div className="navigation">
        <button type="button" onClick={onPrev}>
          Zurück
        </button>
        <button type="button" onClick={onNext} disabled={!canProceed}>
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepContactDetails;