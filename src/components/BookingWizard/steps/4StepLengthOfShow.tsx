import React, { useState } from 'react';
import type { BookingData } from '../types';
import { Button } from '../../ui/button';

export interface StepLengthOfShowProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepLengthOfShow: React.FC<StepLengthOfShowProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const [customMode, setCustomMode] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onChange({ duration_minutes: isNaN(value) ? 0 : value });
  };

  return (
    <div className="step">
      <h2 className="text-4xl text-center mb-5 font-black font-mono">Dauer der Show</h2>
      <div className="input-group flex flex-col items-center justify-center" style={{ margin: '16px 0' }}>
        <label className="flex justify-center mb-5" htmlFor="durationSelect">Dauer auswählen:</label>
        <select
          id="durationSelect"
          value={customMode ? 'custom' : data.duration_minutes.toString()}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'custom') {
              setCustomMode(true);
              
            } else {
              const minutes = parseInt(val, 10);
              setCustomMode(false);
              onChange({ duration_minutes: isNaN(minutes) ? 0 : minutes });
              onNext();
            }
            
          }}
          className="w-1/5 mb-5 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="5">5 Minuten</option>
          <option value="10">10 Minuten</option>
          <option value="15">15 Minuten</option>
          {data.team_size !== 1 && (
            <option value="20">20 Minuten</option>
          )}
          <option value="custom">Andere...</option>
        </select>
        {customMode && (
          <>
            <input
              type="number"
              min={1}
              value={data.duration_minutes || ''}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                onChange({ duration_minutes: isNaN(v) ? 0 : v });
              }}
              placeholder="Minuten"
              className="w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              variant="default"
              onClick={onNext}
              disabled={data.duration_minutes < 1}
              className="mt-4"
            >
              Weiter
            </Button>
          </>
        )}
      </div>
      
    </div>
  );
};

export default StepLengthOfShow;