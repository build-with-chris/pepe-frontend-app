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
    <div className="step flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mt-4">Kontakt & Rabatt</h2>
      <div className="w-2/3 mx-auto mb-6">
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="clientName"
          type="text"
          value={data.client_name}
          onChange={handleNameChange}
          placeholder="Dein Name"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-2/3 mx-auto mb-6">
        <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
          E-Mail
        </label>
        <input
          id="clientEmail"
          type="email"
          value={data.client_email}
          onChange={handleEmailChange}
          placeholder="name@beispiel.de"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-2/3 mx-auto mb-6 flex items-center">
        <input
          id="newsletter"
          type="checkbox"
          checked={data.newsletter_opt_in}
          onChange={handleNewsletterChange}
          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="newsletter" className="ml-3 text-gray-700">
          Newsletter abonnieren (5% Rabatt)
        </label>
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
          disabled={!canProceed}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepContactDetails;