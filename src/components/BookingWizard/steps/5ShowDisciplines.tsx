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
            <label
              key={option}
              className={`flex flex-col items-center justify-center p-2 cursor-pointer rounded-lg border-2 ${
                data.disciplines.includes(option) ? 'border-gray-800' : 'border-transparent'
              }`}
              onClick={() => toggleDiscipline(option)}
            >
              <img
                src={`/images/disciplines/${option.replace(/ /g, '_')}.jpg`}
                alt={option}
                className="pointer-events-none w-24 h-32 md:w-32 md:h-48 mb-2"
              />
              <input
                type="checkbox"
                checked={data.disciplines.includes(option)}
                readOnly
                className="mb-2"
              />
              <span className="text-center">{option}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="navigation flex justify-between w-2/3 mt-4">
        <button
          type="button"
          onClick={onPrev}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={data.disciplines.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepShowDisciplines;