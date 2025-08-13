import React, { useState, useEffect, useCallback } from 'react';
import type { BookingData } from '../types';
import OptionCard from '../OptionCard';
import InfoBox from '../Infobox';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export interface StepLocationProps {
  data: BookingData;
  onChange: (update: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepLocation: React.FC<StepLocationProps> = ({
  data,
  onChange,
  onNext,
}) => {
  // Separate address fields: Straße, PLZ, Stadt
  const [street, setStreet] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [hasSelection, setHasSelection] = useState(false);

  // Coordinates for artist home and event city
  const [artistCoord, setArtistCoord] = useState<{ lat: number; lon: number } | null>(null);
  const [eventCoord, setEventCoord] = useState<{ lat: number; lon: number } | null>(null);

  const haversineDistance = useCallback((c1: { lat: number; lon: number }, c2: { lat: number; lon: number }) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(c2.lat - c1.lat);
    const dLon = toRad(c2.lon - c1.lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(c1.lat)) * Math.cos(toRad(c2.lat)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  useEffect(() => {
    fetch('/api/artists/me')
      .then(res => res.json())
      .then(data => {
        if (data.home_address) {
          // Geocode the artist's home using Nominatim
          fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(data.home_address)}&format=json&limit=1`)
            .then(res => res.json())
            .then(results => {
              if (results[0]) {
                setArtistCoord({
                  lat: parseFloat(results[0].lat),
                  lon: parseFloat(results[0].lon),
                });
              }
            });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (city && artistCoord) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`)
        .then(res => res.json())
        .then(results => {
          if (results[0]) {
            const ev = { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) };
            setEventCoord(ev);
            const dist = haversineDistance(artistCoord, ev);
            onChange({ distance_km: Math.round(dist) });
          }
        })
        .catch(() => {});
    }
  }, [city, artistCoord, haversineDistance, onChange]);

  // Combine into single event_address on change
  const updateAddress = (newStreet: string, newPostalCode: string, newCity: string) => {
    const addr = `${newStreet}${newPostalCode ? ', ' + newPostalCode : ''}${newCity ? ' ' + newCity : ''}`.trim();
    onChange({ event_address: addr });
  };

  const handleIndoorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ is_indoor: e.target.value === 'true' });
  };

  return (
    <div className="step pb-28">
      <h2 className="text-3xl mb-10 md:text-4xl text-center mb-3 font-extrabold">Wo findet deine Veranstaltung statt?</h2>
      <div className="flex flex-col lg:flex-row lg:space-x-4 w-full max-w-[800px] mx-auto mb-6">
      <div className="w-full lg:w-1/2 mb-4">
        <label htmlFor="street" className="block text-sm font-medium text-neutral-200">
          Straße
        </label>
        <input
          id="street"
          type="text"
          value={street}
          onChange={e => { const v = e.target.value; setStreet(v); updateAddress(v, postalCode, city); }}
          placeholder="Musterstraße 1"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full lg:w-1/4 mb-4">
        <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-200">
          PLZ
        </label>
        <input
          id="postalCode"
          type="text"
          value={postalCode}
          onChange={e => { const v = e.target.value; setPostalCode(v); updateAddress(street, v, city); }}
          placeholder="12345"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full lg:w-1/4 mb-4">
        <label htmlFor="city" className="block text-sm font-medium text-neutral-200">
          Stadt <span className="text-red-500">*</span>
        </label>
        <input
          id="city"
          type="text"
          required
          value={city}
          onChange={e => { const v = e.target.value; setCity(v); updateAddress(street, postalCode, v); }}
          placeholder="Musterstadt"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 w-full">
        <div className="w-full max-w-[380px]">
          <OptionCard
            name="is_indoor"
            value="true"
            label="Indoor"
            imgSrc="/images/indoor.webp"
            checked={hasSelection && data.is_indoor === true}
            onChange={val => {
              setHasSelection(true);
              onChange({ is_indoor: val === 'true' });
              if (street && postalCode && city) {
                onNext();
              }
            }}
          />
        </div>
        <div className="w-full max-w-[380px]">
          <OptionCard
            name="is_indoor"
            value="false"
            label="Outdoor"
            imgSrc="/images/outdoor.webp"
            checked={hasSelection && data.is_indoor === false}
            onChange={val => {
              setHasSelection(true);
              onChange({ is_indoor: val === 'true' });
              if (street && postalCode && city) {
                onNext();
              }
            }}
          />
        </div>
      </div>

      {/* Erklärung – Desktop & Tablet */}
      <div className="hidden md:block w-full lg:w-2/3 mx-auto mt-4">
        <InfoBox
          title="Warum wir das fragen"
          text={
            <>
              Die Location beeinflusst, welche Künstler logistisch passen und ob besondere technische Anforderungen bestehen. So können wir dir die bestmöglichen Vorschläge machen.
            </>
          }
        />
      </div>

      {/* Erklärung – Mobile: nur Accordion */}
      <div className="md:hidden w-full lg:w-2/3 mx-auto mt-3 px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="why-location">
            <AccordionTrigger>
              Warum wir nach der Location fragen
            </AccordionTrigger>
            <AccordionContent>
              Die Location beeinflusst, welche Künstler logistisch passen und ob besondere technische Anforderungen bestehen. So können wir dir die bestmöglichen Vorschläge machen.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Fixed footer CTA */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-4 bg-black/60 backdrop-blur-sm flex justify-center">
        <button
          type="button"
          onClick={onNext}
          disabled={!street || !postalCode || !city || !hasSelection}
          className={`bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-opacity ${(!street || !postalCode || !city || !hasSelection) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          aria-label="Weiter zum nächsten Schritt"
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default StepLocation;
