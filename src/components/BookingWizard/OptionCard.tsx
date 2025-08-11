// src/components/BookingWizard/OptionCard.tsx
import React, { useState } from 'react';

export interface OptionCardProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  imgSrc: string;
  onChange: (value: string) => void;
  onSelectNext?: () => void;
  autoAdvance?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({
  name,
  value,
  label,
  checked,
  imgSrc,
  onChange,
  onSelectNext,
  autoAdvance = true,
}) => {
  const [flash, setFlash] = useState(false);

  const handleSelect = () => {
    onChange(value);
    setFlash(true);
    window.setTimeout(() => {
      setFlash(false);
      if (onSelectNext && autoAdvance) onSelectNext();
    }, 180);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
  };

  return (
    <label
      role="radio"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleSelect}
      className={
        `w-full max-w-[380px] flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-150 ` +
        `${checked || flash ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-600/10' : 'border-gray-300 hover:shadow-lg'}`
      }
    >
      <img
        src={imgSrc}
        alt={label}
        className="object-cover w-full h-44 md:h-64 lg:h-88 mb-3"
      />
      <span className="text-center font-medium select-none">{label}</span>
      {/* Visually hidden native input for forms/accessibility if needed */}
      <input type="radio" name={name} value={value} checked={checked} onChange={() => {}} className="sr-only" />
    </label>
  );
};

export default OptionCard;