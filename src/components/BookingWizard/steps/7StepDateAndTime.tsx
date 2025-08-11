import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { BookingData } from '../types';

export interface StepDateAndTimeProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}


const StepDateAndTime: React.FC<StepDateAndTimeProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ event_date: e.target.value });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ event_time: e.target.value });
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onChange({ number_of_guests: isNaN(value) ? 0 : value });
  };

  return (
    <div className="step flex flex-col items-center pb-28">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Wann findet deine Veranstaltung statt?</h2>
      <div className="w-full max-w-2xl mx-auto bg-gray-100 text-gray-700 rounded-lg p-3 mb-6">
        <p className="text-sm leading-relaxed text-center">
          <span className="font-semibold">Warum wir das fragen:&nbsp;</span>
          Datum und Uhrzeit helfen uns, die Verfügbarkeit der Künstler zu prüfen und die Planung optimal auf dein Event abzustimmen.
        </p>
      </div>
      <div className="flex w-1/3 mx-auto mb-6 space-x-4">
        <div className="flex-1">
          <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
            Datum
          </label>
          <div className="relative">
            <input
              id="eventDate"
              type="date"
              value={data.event_date}
              onChange={handleDateChange}
              className="block w-full pr-10 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="eventDate">
              <Calendar
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                aria-hidden="true"
              />
            </label>
          </div>
        </div>
        <div className="flex-1">
          <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-1">
            Uhrzeit
          </label>
          <div className="relative">
            <input
              id="eventTime"
              type="time"
              value={data.event_time}
              onChange={handleTimeChange}
              className="block w-full pr-10 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="eventTime">
              <Clock
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                aria-hidden="true"
              />
            </label>
          </div>
        </div>
      </div>
      <div className="w-1/3 mx-auto mb-6">
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
          Anzahl der Gäste
        </label>
        <input
          id="guests"
          type="number"
          min={1}
          value={data.number_of_guests}
          onChange={handleGuestsChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onNext();
            }
          }}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Fixed footer CTA */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-4 bg-black/60 backdrop-blur-sm flex justify-center">
        <button
          type="button"
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg"
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepDateAndTime;