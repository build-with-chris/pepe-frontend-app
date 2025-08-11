import React from 'react';
import type { BookingData } from '../types';

export interface StepDisciplinesProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const disciplinesOptions: { name: string; description: string }[] = [
  { name: 'Zauberer', description: 'Illusionen, Tricks und magische Momente für jedes Publikum.' },
  { name: 'Cyr-Wheel', description: 'Akrobatische Performance in einem großen rotierenden Rad.' },
  { name: 'Bodenakrobatik', description: 'Beeindruckende akrobatische Bewegungen und Figuren am Boden.' },
  { name: 'Luftakrobatik', description: 'Schwebende Kunststücke an Tuch, Trapez oder Reifen.' },
  { name: 'Partnerakrobatik', description: 'Akrobatik zu zweit oder in der Gruppe mit spektakulären Hebefiguren.' },
  { name: 'Chinese Pole', description: 'Kraftvolle Akrobatik und Tricks an der chinesischen Stange.' },
  { name: 'Hula Hoop', description: 'Dynamische Shows mit rotierenden Reifen und viel Bewegung.' },
  { name: 'Handstand', description: 'Kraft, Balance und Kontrolle bei Handstand-Performances.' },
  { name: 'Contemporary Dance', description: 'Moderne Tanzkunst mit Ausdruck und Emotion.' },
  { name: 'Breakdance', description: 'Urbane Tanzstile mit akrobatischen Moves und Powermoves.' },
  { name: 'Teeterboard', description: 'Sprünge und Saltos auf dem federnden Brett.' },
  { name: 'Jonglage', description: 'Kunstvolles Werfen und Fangen von Bällen, Keulen oder Ringen.' },
  { name: 'Moderation', description: 'Professionelle und unterhaltsame Leitung durch das Programm.' },
  { name: 'Pantomime/Entertainment', description: 'Wortlose Unterhaltung, Comedy und Interaktion.' }
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
          {disciplinesOptions.map(({ name, description }) => (
            <div
              key={name}
              onClick={() => toggleDiscipline(name)}
              className={`aspect-square w-2/3 relative cursor-pointer rounded-lg overflow-hidden group ${
                data.disciplines.includes(name)
                  ? 'border-4 border-blue-500'
                  : 'border-2 border-transparent'
              }`}
            >
              <img
                src={`/images/disciplines/${name.replace(/ /g, '_')}.webp`}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover transition duration-200 group-hover:brightness-75"
              />
              <div className="absolute bottom-0 w-full bg-black/50 py-1 transition-opacity group-hover:opacity-0">
                <span className="text-white text-center block text-sm">{name}</span>
              </div>
              <div className="absolute inset-x-3 bottom-3 bg-black/60 text-white rounded-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-md text-center leading-snug">{description}</p>
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
          disabled={data.disciplines.length === 0}
          className={`bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-opacity ${data.disciplines.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          aria-label="Weiter zum nächsten Schritt"
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepShowDisciplines;