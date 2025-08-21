import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';
import InfoBox from '../Infobox';
// NEU: Accordion von shadcn
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export interface StepEventTypeProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepEventType: React.FC<StepEventTypeProps> = ({ data, onChange, onNext }) => {
  const options = [
    { value: 'Private Feier', label: 'Private Feier', img: 'Private_Feier' },
    { value: 'Firmenfeier', label: 'Firmenfeier', img: 'Firmenfeier' },
    { value: 'Incentive', label: 'Teamevent', img: 'Incentive' },
    { value: 'Streetshow', label: 'Streetshow', img: 'Streetshow' },
  ];

  return (
    <div className="p-0 w-full mx-auto md:max-w-4/5">
      <h2 className="text-3xl md:text-4xl text-center mb-7 font-extrabold">
        Welchen Event‑Typ planst du?
      </h2>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 w-full">
        {options.map(option => (
          <OptionCard
            key={option.value}
            name="event_type"
            value={option.value}
            label={option.label}
            imgSrc={`/images/eventTypes/${option.img}.webp`}
            checked={data.event_type === option.value}
            onChange={val => onChange({ event_type: val })}
            onSelectNext={onNext}
          />
        ))}
      </div>

    </div>
  );
};

export default StepEventType;