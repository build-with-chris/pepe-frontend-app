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
    <div className="step flex flex-col items-center">
      <h2 className="text-4xl font-bold text-center mt-4">Datum & Uhrzeit</h2>
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
            <Calendar
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
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
            <Clock
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
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
    </div>
  );
};

export default StepDateAndTime;