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
    <div className="step flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mt-4">Disziplinen auswählen</h2>
      <div className="w-full overflow-auto px-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {disciplinesOptions.map(option => (
            <div
              key={option}
              onClick={() => toggleDiscipline(option)}
              className={`w-full flex flex-col items-center justify-center p-2 cursor-pointer rounded-lg border-2 ${
                data.disciplines.includes(option) ? 'border-gray-800' : 'border-transparent'
              }`}
            >
              <img
                src={`/images/disciplines/${option.replace(/ /g, '_')}.jpg`}
                alt={option}
                className="w-24 h-32 md:w-32 md:h-48 mb-2"
              />
              <span className="text-center">{option}</span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default StepShowDisciplines;