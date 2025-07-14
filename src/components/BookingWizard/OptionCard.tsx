// src/components/BookingWizard/OptionCard.tsx
import React from 'react';

export interface OptionCardProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  imgSrc: string;
  onChange: (value: string) => void;
  onSelectNext?: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  name,
  value,
  label,
  checked,
  imgSrc,
  onChange,
  onSelectNext,
}) => {
  const handleChange = () => {
    onChange(value);
    if (onSelectNext) onSelectNext();
  };

  return (
    <label
      className={
        `flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:shadow-lg ` +
        (checked ? 'border-blue-500' : 'border-gray-300')
      }
    >
      <img
        src={imgSrc}
        alt={label}
        className="object-cover w-full h-44 md:h-64 lg:h-88 mb-2"
      />
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        className="mb-2"
      />
      <span className="text-center">{label}</span>
    </label>
  );
};

export default OptionCard;