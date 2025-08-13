import React from 'react';
import type { BookingData } from '../types';
import { Mail } from 'lucide-react';
import InfoBox from '../Infobox';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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

  const handlePlanningChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange({ planning_status: value } as any);
  };

  return (
    <div className="step flex flex-col items-center pb-28">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Wie dürfen wir dich für Rückfragen kontaktieren?</h2>
      <div className="w-full lg:w-1/3 mx-auto mb-6">
        <label htmlFor="clientName" className="block text-sm font-medium text-white">
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
        <label htmlFor="clientEmail" className="block text-sm font-medium text-white">
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
        <label htmlFor="planningStatus" className="block text-sm font-medium text-black">
          Planungsstatus <span className="text-xs text-black/70">(optional)</span>
        </label>
        <select
          id="planningStatus"
          value={(data as any).planning_status || ""}
          onChange={handlePlanningChange}
          className="mt-1 block w-full border border-white rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-white bg-black text-white"
        >
          <option value="">Bitte auswählen …</option>
          <option value="Erstplanung">Erstplanung</option>
          <option value="Angebotsvergleich">Angebotsvergleich</option>
          <option value="Bereit zum Buchen">Bereit zum Buchen</option>
          <option value="schneller Bedarf">schneller Bedarf</option>
        </select>
      </div>
      <div className="w-full lg:w-1/3 mx-auto mb-6">
        <div className="flex items-center space-x-4 p-4 border border-white/20 rounded-lg bg-black/30 hover:bg-black/40 transition text-white">
          <input
            id="newsletter"
            type="checkbox"
            checked={data.newsletter_opt_in}
            onChange={handleNewsletterChange}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-10"
          />
          <Mail className="h-6 w-6 text-blue-600 animate-bounce" />
          <div className="flex-1">
            <label htmlFor="newsletter" className="text-sm font-medium text-white">
              Newsletter abonnieren (5% Rabatt auf diese Anfrage)
            </label>
            <p className="text-xs text-white/80 mt-1">
              Wir informieren dich über neueste Acts, Showorte und Veranstaltungen.
              Kein Spam, versprochen!
            </p>
          </div>
        </div>
      </div>
      {/* Erklärung – Desktop & Tablet */}
      <div className="hidden md:block w-full lg:w-1/3 mx-auto mt-2">
        <InfoBox
          title="Warum wir das fragen"
          text={
            <>Damit wir dir die passenden Angebote zusenden und bei Rückfragen schnell reagieren können.</>
          }
        />
      </div>

      {/* Erklärung – Mobile: nur Accordion */}
      <div className="md:hidden w-full lg:w-1/3 mx-auto mt-2 px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="why-contact">
            <AccordionTrigger>
              Warum wir nach deinen Kontaktdaten fragen
            </AccordionTrigger>
            <AccordionContent>
              Damit wir dir die passenden Angebote zusenden und bei Rückfragen schnell reagieren können.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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