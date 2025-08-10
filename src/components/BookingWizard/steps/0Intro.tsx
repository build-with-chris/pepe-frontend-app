import React from 'react';

/**
 * Landing page component for the booking wizard.
 *
 * This page introduces visitors to the service and encourages them to begin
 * the short questionnaire that collects event details and provides a first
 * price estimate. The design uses the existing Pepe colour palette of
 * black and white with a blue accent, conveying a high‑end, elegant
 * appearance.
 */
export interface BookingStartPageProps {
  /**
   * Callback invoked when the user clicks the start button. This should
   * advance the wizard to the first question.
   */
  onStart: () => void;
}

const BookingStartPage: React.FC<BookingStartPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-8">
      {/* Heading conveys that we match the right artists and deliver offers */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-center leading-tight">
        Die passenden&nbsp;Artisten für deine&nbsp;Veranstaltung
      </h1>
      {/* Subheading explains the process and sets expectations */}
      <p className="text-base sm:text-lg md:text-xl mb-10 max-w-xl text-center text-gray-300">
        In wenigen Schritten vermitteln wir dir die besten Acts und erstellen
        unverbindliche&nbsp;Angebote. Beantworte einfach ein paar kurze Fragen,
        um deine Show zu planen und eine erste Preisidee zu erhalten.
      </p>
      {/* Start button with blue accent inviting users to begin the questionnaire */}
      <button
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
      >
        Jetzt starten
      </button>
    </div>
  );
};

export default BookingStartPage;