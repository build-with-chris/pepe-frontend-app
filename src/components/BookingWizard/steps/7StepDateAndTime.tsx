import React from 'react';
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

  return (
    <div className="step flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mt-4">Datum & Uhrzeit</h2>
      <div className="w-2/3 mx-auto mb-6">
        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
          Datum
        </label>
        <input
          id="eventDate"
          type="date"
          value={data.event_date}
          onChange={handleDateChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-2/3 mx-auto mb-6">
        <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">
          Uhrzeit
        </label>
        <input
          id="eventTime"
          type="time"
          value={data.event_time}
          onChange={handleTimeChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="navigation">
        <button type="button" onClick={onPrev}>
          Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!data.event_date || !data.event_time}
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepDateAndTime;