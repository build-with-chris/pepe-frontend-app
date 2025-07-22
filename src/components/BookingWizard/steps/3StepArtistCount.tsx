

import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';

export interface StepArtistCountProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepArtistCount: React.FC<StepArtistCountProps> = ({
  data,
  onChange,
  onNext,
  onPrev
}) => {
  const options: { label: string; value: number }[] = [
    { label: 'Solo', value: 1 },
    { label: 'Duo', value: 2 },
    { label: 'Gruppe', value: 3 }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ team_size: Number(e.target.value) });
  };

  return (
    <div className="step">
      <h2 className="text-4xl text-center mb-5 font-black font-mono">Anzahl der Artists</h2>
      <div className="grid grid-cols-3 gap-4 w-full lg:w-2/3 mx-auto">
        {options.map(option => (
          <OptionCard
            key={option.value}
            name="team_size"
            value={option.value.toString()}
            label={option.label}
            imgSrc={`/images/teamSizes/${option.label.replace(/ /g, '_')}.webp`}
            checked={data.team_size === option.value}
            onChange={val => { onChange({ team_size: Number(val) }); onNext(); }}
          />
        ))}
      </div>
      
    </div>
  );
};

export default StepArtistCount;