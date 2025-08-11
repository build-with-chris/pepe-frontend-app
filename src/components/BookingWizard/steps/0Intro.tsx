import React from 'react';
import PepeLogo from '../../../assets/PepeSchrift.png';

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
  onStart?: () => void;
}

const BookingStartPage: React.FC<BookingStartPageProps> = ({ onStart }) => {
  const handleStart = React.useCallback(() => {
    if (typeof onStart === 'function') {
      onStart();
    } else {
      // Prevent hard crash if parent forgot to pass onStart
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[BookingStartPage] onStart prop is missing or not a function');
      }
    }
  }, [onStart]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-24 bg-black text-white px-4">
        <img src={PepeLogo} alt="Pepe Logo" className="w-auto max-w-xs mb-2" />
        <p className="text-sm sm:text-base md:text-lg text-gray-300 mt-2 text-center">Artistenfinder</p>
      {/* Heading conveys that we match the right artists and deliver offers */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-15 mb-6 text-center leading-tight">
        Die passenden&nbsp;Artisten für deine&nbsp;Veranstaltung
        </h1>
      <p className="text-base sm:text-lg md:text-xl mb-10 max-w-xl text-center text-gray-300">
        In wenigen Schritten vermitteln wir dir die besten Acts und erstellen
        unverbindliche&nbsp;Angebote. Beantworte einfach ein paar kurze Fragen,
        um deine Show zu planen und eine erste Preisidee zu erhalten.
      </p>
      <button
        type="button"
        onClick={handleStart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
      >
        Jetzt starten
      </button>
    </div>
  );
};

export default BookingStartPage;