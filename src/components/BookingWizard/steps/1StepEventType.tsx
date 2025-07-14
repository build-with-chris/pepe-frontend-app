import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';

export interface StepEventTypeProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepEventType: React.FC<StepEventTypeProps> = ({ data, onChange, onNext }) => {
  const options = ['Private Feier', 'Firmenfeier', 'Incentive', 'Streetshow'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ event_type: e.target.value });
    onNext();
  };

  return (
    <div className="p-5 w-2/3 mx-auto">
      <h2 className="text-4xl text-center mb-5 font-black font-mono">Event Typ</h2>
      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map(option => (
          <OptionCard
            key={option}
            name="event_type"
            value={option}
            label={option}
            imgSrc={`/images/eventTypes/${option.replace(/ /g, '_')}.jpg`}
            checked={data.event_type === option}
            onChange={val => { onChange({ event_type: val }); onNext(); }}
          />
        ))}
      </div>
    </div>
  );
};

export default StepEventType;