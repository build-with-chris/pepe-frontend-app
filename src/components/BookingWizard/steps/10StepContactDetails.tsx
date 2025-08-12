import React from 'react';
import type { BookingData } from '../types';
import { Mail } from 'lucide-react';
import InfoBox from '../Infobox';

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

  return (
    <div className="step flex flex-col items-center pb-28">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Wie dürfen wir dich für Rückfragen kontaktieren?</h2>
      <InfoBox
        title="Warum wir das fragen"
        text={
          <>Damit wir dir die passenden Angebote zusenden und bei Rückfragen schnell reagieren können.</>
        }
      />
      <div className="w-full lg:w-1/3 mx-auto mb-6">
        <label htmlFor="clientName" className="block text-sm font-medium text-neutral-200">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="clientName"
          type="text"
          required
          value={data.client_name}
          onChange={handleNameChange}
          placeholder="Dein Name"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full lg:w-1/3 mx-auto mb-6">
        <label htmlFor="clientEmail" className="block text-sm font-medium text-neutral-200">
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
        <p className="text-xs text-gray-300 mt-1">
          Mit Angabe deiner E‑Mail-Adresse erlaubst du uns, dir unverbindliche Angebotsvorschläge zu dieser Anfrage zuzusenden. Du kannst dem jederzeit widersprechen.
        </p>
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
      {/* Fixed footer CTA */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-4 bg-black/60 backdrop-blur-sm flex justify-center">
        <button
          type="button"
          onClick={onNext}
          disabled={!data.client_name || !data.client_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.client_email)}
          className={`bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-opacity ${(!data.client_name || !data.client_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.client_email)) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepContactDetails;