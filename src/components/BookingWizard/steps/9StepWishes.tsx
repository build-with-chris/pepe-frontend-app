import React from 'react';
import type { BookingData } from '../types';
import InfoBox from '../Infobox';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Info } from "lucide-react";

export interface StepWishesProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepWishes: React.FC<StepWishesProps> = ({ data, onChange, onNext, onPrev }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ special_requests: e.target.value });
  };

  const toggle = (field: 'needs_light' | 'needs_sound') => {
    onChange({ [field]: !(data as any)[field] } as any);
  };

  const PriceBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="ml-2 inline-flex items-center rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/90">{children}</span>
  );

  return (
    <div className="w-full step flex flex-col items-center pb-28">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold mb-10">Hast du besondere Wünsche oder Ideen für die Show?</h2>

      {/* Unified content wrapper for consistent left edge */}
      <div className="w-full max-w-3xl mx-auto px-4">
        {/* Wishes textarea */}
        <div className="mb-6">
          <label htmlFor="wishes" className="block text-lg font-semibold text-white mb-2 text-left">
            Hier kannst du deine Wünsche eintragen:
          </label>
          <textarea
            id="wishes"
            value={data.special_requests}
            onChange={handleChange}
            placeholder={`z.B. Aufteilung der Show in mehrere kleine Shows\nMixform aus Walking Act und Bühnenshow\nbestimmtes Motto das getroffen werden soll`}
            rows={8}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white placeholder:text-white/70"
          />
        </div>

        {/* Needs: Light & Sound (stacked, aligned with textarea) */}
        <div className="flex flex-col gap-4 mb-8">
          {[
            { key: 'light', label: 'Licht benötigt', field: 'needs_light', checked: data.needs_light, price: '450€', hint: 'Sorgt für Atmosphäre und dramaturgische Akzente.' },
            { key: 'sound', label: 'Musikanlage benötigt', field: 'needs_sound', checked: data.needs_sound, price: '450€', hint: 'Klarer, tragfähiger Sound – optional mit Headset.' },
          ].map(option => (
            <label key={option.key} className="flex flex-col gap-1 cursor-pointer">
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={() => onChange({ [option.field]: !option.checked } as any)}
                  className="h-6 w-6 text-blue-600 border border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-white font-medium flex items-center gap-2">
                  {option.label}
                  <PriceBadge>{option.price}</PriceBadge>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="ml-1 text-white/70 hover:text-white" aria-label="Mehr Infos">
                        <Info className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-sm bg-black text-white text-sm p-4 rounded-lg border border-white/20 shadow-lg">
                      {option.key === 'sound' ? (
                        <>
                          Für eine professionelle Darbietung ist <strong>qualitativer Sound</strong> essentiell. Je nach Raum oder Gelände braucht es unterschiedlich große Anlagen, damit die Musik überall <strong>klar</strong> ankommt. Bei <strong>Moderation, Zauberei</strong> oder anderen sprachlastigen Acts empfiehlt sich ab <strong>~50 Personen</strong> zusätzlich ein <strong>Headset-Mikrofon</strong> – so versteht euch das Publikum in jeder Ecke.
                          <div className="mt-3 flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => toggle('needs_sound')}
                              className="px-3 py-2 rounded-full border border-white/20 hover:bg-white/10 text-white text-sm w-fit"
                            >{data.needs_sound ? 'Sound abwählen' : 'Sound hinzufügen '}</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <strong>Licht</strong> schafft <strong>Dramaturgie</strong>: Es setzt Highlights, baut Spannung auf und verwandelt ein gutes Event in ein <strong>großartiges</strong>. Stimmungen lassen sich präzise lenken – vom eleganten Warm-up bis zum finalen Gänsehautmoment.
                          <div className="mt-3 flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => toggle('needs_light')}
                              className="px-3 py-2 rounded-full border border-white/20 hover:bg-white/10 text-white text-sm w-fit"
                            >{data.needs_light ? 'Licht abwählen' : 'Licht hinzufügen '}</button>
                          </div>
                        </>
                      )}
                    </PopoverContent>
                  </Popover>
                </span>
              </span>
              <span className="text-sm text-white/80 pl-9 -mt-1">{option.hint}</span>
            </label>
          ))}
        </div>

      </div>
      
     

      {/* Fixed footer CTA */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-4 bg-black/60 backdrop-blur-sm flex justify-center">
        <button
          type="button"
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg"
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepWishes;