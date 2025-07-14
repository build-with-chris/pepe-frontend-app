

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
    <div className="step">
      <h2>Disziplinen auswählen</h2>
      <div
        className="options-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '16px',
          margin: '16px 0',
        }}
      >
        {disciplinesOptions.map(option => (
          <label
            key={option}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              border: data.disciplines.includes(option) ? '2px solid #333' : '2px solid transparent',
              borderRadius: '8px',
              padding: '8px',
            }}
          >
            <img
              src={`/images/disciplines/${option.replace(/ /g, '_')}.png`}
              alt={option}
              style={{ width: '48px', height: '48px', marginBottom: '8px' }}
            />
            <input
              type="checkbox"
              checked={data.disciplines.includes(option)}
              onChange={() => toggleDiscipline(option)}
              style={{ marginBottom: '4px' }}
            />
            <span style={{ textAlign: 'center' }}>{option}</span>
          </label>
        ))}
      </div>
      <div className="navigation">
        <button type="button" onClick={onPrev}>
          Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={data.disciplines.length === 0}
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepShowDisciplines;