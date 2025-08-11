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
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Welchen Show‑Typ stellst du dir vor?</h2>
      <div className="w-full max-w-2xl mx-auto bg-gray-100 text-gray-700 rounded-lg p-3 mb-6">
        <p className="text-sm leading-relaxed text-center">
          <span className="font-semibold">Warum wir das fragen:&nbsp;</span>
          Damit wir einschätzen können, ob ein flexibler Walking Act oder eine feste Bühnenshow besser zu deinem Event passt – und dir passende Vorschläge machen können.
        </p>
      </div>
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
