import React from 'react';
import type { BookingData } from '../types';

export interface StepDisciplinesProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const disciplinesOptions: string[] = [
  'Zauberer',
  'Cyr-Wheel',
  'Bodenakrobatik',
  'Luftakrobatik',
  'Partnerakrobatik',
  'Chinese Pole',
  'Hula Hoop',
  'Handstand',
  'Contemporary Dance',
  'Breakdance',
  'Teeterboard',
  'Jonglage',
  'Moderation',
  'Pantomime/Entertainment'
];

const StepShowDisciplines: React.FC<StepDisciplinesProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const toggleDiscipline = (discipline: string) => {
    const selected = data.disciplines.includes(discipline);
    const newList = selected
      ? data.disciplines.filter(d => d !== discipline)
      : [...data.disciplines, discipline];
    onChange({ disciplines: newList });
  };

  return (
    <div className="step flex flex-col items-center pb-28">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Welche Disziplinen interessieren dich?</h2>
      <p className="text-sm text-white-200 text-center mb-2">(Mehrfachauswahl möglich)</p>
      <div className="w-full max-w-2xl mx-auto bg-gray-100 text-gray-700 rounded-lg p-3 mb-6">
        <p className="text-sm leading-relaxed text-center">
          <span className="font-semibold">Warum wir das fragen:&nbsp;</span>
          Jede Disziplin bringt eigene Requisiten, Anforderungen und Effekte mit. So können wir dir gezielt Künstler empfehlen, die genau das bieten, was dich begeistert.
        </p>
      </div>
      <div className="w-full overflow-auto px-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {disciplinesOptions.map(option => (
            <div
              key={option}
              onClick={() => toggleDiscipline(option)}
              className={`aspect-square w-2/3 relative cursor-pointer rounded-lg overflow-hidden ${
                data.disciplines.includes(option)
                  ? 'border-4 border-blue-500'
                  : 'border-2 border-transparent'
              }`}
            >
              <img
                src={`/images/disciplines/${option.replace(/ /g, '_')}.webp`}
                alt={option}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 py-1">
                <span className="text-white text-center block text-sm">{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Fixed footer CTA */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-4 bg-black/60 backdrop-blur-sm flex justify-center">
        <button
          type="button"
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg"
          aria-label="Weiter zum nächsten Schritt"
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepShowDisciplines;