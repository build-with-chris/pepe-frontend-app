import React from 'react';
import type { BookingData } from '../types';
import { Mail } from 'lucide-react';

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
      <h2 className="text-4xl font-bold text-center mt-4">Kontakt & Rabatt</h2>
      <div className="w-full lg:w-1/3 mx-auto mb-6">
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
      <div className="w-full lg:w-1/3 mx-auto mb-6">
        <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
          E-Mail <span className="text-red-500">*</span>
        </label>
        <input
          id="clientEmail"
          type="email"
          required
          value={data.client_email}
          onChange={handleEmailChange}
          placeholder="name@beispiel.de"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full lg:w-1/3 mx-auto mb-6">
        <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
          <input
            id="newsletter"
            type="checkbox"
            checked={data.newsletter_opt_in}
            onChange={handleNewsletterChange}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-10"
          />
          <Mail className="h-6 w-6 text-blue-600 animate-bounce" />
          <div className="flex-1">
            <label htmlFor="newsletter" className="text-sm font-medium text-gray-700">
              Newsletter abonnieren (5% Rabatt auf diese Anfrage)
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Wir informieren dich über neueste Acts, Showorte und Veranstaltungen.
              Kein Spam, versprochen!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepContactDetails;