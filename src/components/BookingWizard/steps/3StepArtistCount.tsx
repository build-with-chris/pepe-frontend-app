import React from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';
import InfoBox from '../Infobox';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">
        Wie viele Artists möchtest du buchen?
      </h2>

      {/* Auswahlkarten */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full lg:w-2/3 mx-auto">
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

      {/* Erklärung – Desktop & Tablet: InfoBox unter den Optionen */}
      <div className="hidden md:block w-full lg:w-2/3 mx-auto mt-4">
        <InfoBox
          title="Warum wir das fragen"
          text={
            <>
              Die Anzahl der Künstler beeinflusst den Ablauf, die Showdynamik und den Preis.
              So können wir dir ein passendes Angebot kalkulieren.
            </>
          }
        />
      </div>

      {/* Erklärung – Mobile: nur Accordion unter den Optionen */}
      <div className="md:hidden w-full lg:w-2/3 mx-auto mt-3">
        <Accordion type="single" collapsible>
          <AccordionItem value="why-artist-count">
            <AccordionTrigger>
              Warum wir nach der Anzahl der Artists fragen
            </AccordionTrigger>
            <AccordionContent>
              Die Anzahl der Künstler beeinflusst den Ablauf, die Showdynamik und den Preis.
              So können wir dir ein passendes Angebot kalkulieren.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default StepArtistCount;