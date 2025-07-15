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
      <h2 className="text-4xl font-bold text-center my-4">Disziplinen auswählen</h2>
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
                src={`/images/disciplines/${option.replace(/ /g, '_')}.jpg`}
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
      
    </div>
  );
};

export default StepShowDisciplines;