import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';

export interface StepShowTypeProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepShowType: React.FC<StepShowTypeProps> = ({ data, onChange, onNext, onPrev }) => {
  const options = ['Walking Act', 'Bühnen Show'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ show_type: e.target.value });
    onNext();
  };

  return (
    <div className="step flex flex-col items-center">
      <h2 className="text-4xl text-center mb-5 font-black font-mono">Show-Typ</h2>
      <div className="p-5 w-full lg:w-2/3 mx-auto grid grid-cols-2 gap-4 md:max-w-3/5">
        {options.map(option => (
          <OptionCard
            key={option}
            name="show_type"
            value={option}
            label={option}
            imgSrc={`/images/showTypes/${option === 'Bühnen Show' ? 'Buehnen_Show' : option.replace(/ /g, '_')}.webp`}
            checked={data.show_type === option}
            onChange={val => onChange({ show_type: val })}
            onSelectNext={onNext}
          />
        ))}
      </div>
    </div>
  );
};

export default StepShowType;
