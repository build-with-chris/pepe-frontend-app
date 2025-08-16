import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';
import InfoBox from '../Infobox';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export interface StepShowTypeProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepShowType: React.FC<StepShowTypeProps> = ({ data, onChange, onNext, onPrev }) => {
  const options = ['Live-Interaktion', 'Bühnen Show'];

  return (
    <div className="step flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Welchen Show‑Typ stellst du dir vor?</h2>
      
      <div className="flex flex-wrap justify-center gap-4 w-full">
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
            autoAdvance={true}
          />
        ))}
      </div>
      <div className="hidden md:block w-full mt-7">
        <InfoBox
          title="Warum wir das fragen"
          text={
            <>Damit wir einschätzen können, ob ein flexibler Walking Act oder eine feste Bühnenshow besser zu deinem Event passt – und dir passende Vorschläge machen können.</>
          }
        />
      </div>
      <div className="md:hidden mt-5 w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="showtype-info">
            <AccordionTrigger>
              Warum wir nach dem Show‑Typ fragen
            </AccordionTrigger>
            <AccordionContent>
              Damit wir einschätzen können, ob ein flexibler Walking Act oder eine feste Bühnenshow besser zu deinem Event passt – und dir passende Vorschläge machen können.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default StepShowType;
