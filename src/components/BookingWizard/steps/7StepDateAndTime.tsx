

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
    <div className="step">
      <h2>Datum & Uhrzeit</h2>
      <div className="input-group" style={{ margin: '16px 0' }}>
        <label htmlFor="eventDate">Datum:</label>
        <input
          id="eventDate"
          type="date"
          value={data.event_date}
          onChange={handleDateChange}
          style={{ marginLeft: '8px' }}
        />
      </div>
      <div className="input-group" style={{ margin: '16px 0' }}>
        <label htmlFor="eventTime">Uhrzeit:</label>
        <input
          id="eventTime"
          type="time"
          value={data.event_time}
          onChange={handleTimeChange}
          style={{ marginLeft: '8px' }}
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