import React, { useCallback } from 'react';
import type { BookingData } from '../types';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

const DISCIPLINE_OPTIONS: { value: string; img: string; labelKey: string; descKey: string }[] = [
  { value: 'Zauberer', img: 'Zauberer', labelKey: 'booking.disciplines.options.zauberer.label', descKey: 'booking.disciplines.options.zauberer.description' },
  { value: 'Cyr-Wheel', img: 'Cyr-Wheel', labelKey: 'booking.disciplines.options.cyrWheel.label', descKey: 'booking.disciplines.options.cyrWheel.description' },
  { value: 'Bodenakrobatik', img: 'Bodenakrobatik', labelKey: 'booking.disciplines.options.bodenakrobatik.label', descKey: 'booking.disciplines.options.bodenakrobatik.description' },
  { value: 'Luftakrobatik', img: 'Luftakrobatik', labelKey: 'booking.disciplines.options.luftakrobatik.label', descKey: 'booking.disciplines.options.luftakrobatik.description' },
  { value: 'Partnerakrobatik', img: 'Partnerakrobatik', labelKey: 'booking.disciplines.options.partnerakrobatik.label', descKey: 'booking.disciplines.options.partnerakrobatik.description' },
  { value: 'Chinese Pole', img: 'Chinese_Pole', labelKey: 'booking.disciplines.options.chinesePole.label', descKey: 'booking.disciplines.options.chinesePole.description' },
  { value: 'Hula Hoop', img: 'Hula_Hoop', labelKey: 'booking.disciplines.options.hulaHoop.label', descKey: 'booking.disciplines.options.hulaHoop.description' },
  { value: 'Handstand', img: 'Handstand', labelKey: 'booking.disciplines.options.handstand.label', descKey: 'booking.disciplines.options.handstand.description' },
  { value: 'Contemporary Dance', img: 'Contemporary_Dance', labelKey: 'booking.disciplines.options.contemporaryDance.label', descKey: 'booking.disciplines.options.contemporaryDance.description' },
  { value: 'Breakdance', img: 'Breakdance', labelKey: 'booking.disciplines.options.breakdance.label', descKey: 'booking.disciplines.options.breakdance.description' },
  { value: 'Teeterboard', img: 'Teeterboard', labelKey: 'booking.disciplines.options.teeterboard.label', descKey: 'booking.disciplines.options.teeterboard.description' },
  { value: 'Jonglage', img: 'Jonglage', labelKey: 'booking.disciplines.options.jonglage.label', descKey: 'booking.disciplines.options.jonglage.description' },
  { value: 'Moderation', img: 'Moderation', labelKey: 'booking.disciplines.options.moderation.label', descKey: 'booking.disciplines.options.moderation.description' },
  { value: 'Pantomime', img: 'Pantomime', labelKey: 'booking.disciplines.options.pantomimeEntertainment.label', descKey: 'booking.disciplines.options.pantomimeEntertainment.description' }
];

export interface StepDisciplinesProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepShowDisciplines: React.FC<StepDisciplinesProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const { t } = useTranslation();

  const toggleDiscipline = useCallback((value: string) => {
    const selected = data.disciplines.includes(value);
    const newList = selected
      ? data.disciplines.filter(d => d !== value)
      : [...data.disciplines, value];
    onChange({ disciplines: newList });
  }, [data.disciplines, onChange]);

  return (
    <div className="step flex flex-col items-center pb-28">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">{t('booking.disciplines.heading')}</h2>
      <p className="text-sm text-white-200 text-center mb-2">{t('booking.disciplines.multi')}</p>
      
      <div className="w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto justify-items-center">
          {DISCIPLINE_OPTIONS.map((opt) => {
            const label = t(opt.labelKey);
            const desc = t(opt.descKey);
            const isSelected = data.disciplines.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleDiscipline(opt.value)}
                aria-pressed={isSelected}
                title={String(label)}
                className={`aspect-square w-full relative cursor-pointer rounded-lg overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isSelected ? 'border-4 border-blue-500' : 'border-2 border-transparent'
                }`}
              >
                <div className="absolute inset-0 w-full h-full">
                  {/* Schwarz-Weiß default */}
                  <img
                    src={`/images/bookingagent/BW/${opt.img}.webp`}
                    alt={String(label)}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition duration-200"
                  />
                  {/* Farbig on hover or selected */}
                  <img
                    src={`/images/bookingagent/Farbig/${opt.img}.webp`}
                    alt={String(label)}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </div>
                <div className="absolute bottom-0 w-full bg-black/50 py-1 transition-opacity group-hover:opacity-0">
                  <span className="text-white text-center block text-sm">{label}</span>
                </div>
                <div className="absolute inset-x-3 bottom-3 bg-black/60 text-white rounded-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="text-md text-center leading-snug">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    {/* Erklärung – Mobile nur als Accordion */}
    <div className="md:hidden w-full mt-3 px-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="why-disciplines">
          <AccordionTrigger>
            {t('booking.disciplines.why.title')}
          </AccordionTrigger>
          <AccordionContent>
            {t('booking.disciplines.why.body')}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
      {/* Fixed footer CTA */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-4 bg-black/60 backdrop-blur-sm flex justify-center">
        <button
          type="button"
          onClick={onNext}
          disabled={data.disciplines.length === 0}
          className={`bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-opacity ${data.disciplines.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          aria-label={t('booking.disciplines.next')}
        >
          {t('booking.disciplines.next')}
        </button>
      </div>
    </div>
  );
};

export default StepShowDisciplines;