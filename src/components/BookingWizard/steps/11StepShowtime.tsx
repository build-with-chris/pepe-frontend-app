import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { BookingData } from '../types';
import { postRequest } from '../../../services/bookingApi';
import { Loader2 } from 'lucide-react';

export interface StepShowtimeProps {
  data: BookingData;
  onPrev: () => void;
}

const StepShowtime: React.FC<StepShowtimeProps> = ({ data, onPrev }) => {
  const responseRef = useRef<HTMLDivElement>(null);

  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (responseRef.current && response) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [response]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await postRequest(data);
      setResponse(res);

      // 👉 Notify the wizard to clear its cached data and also clear here as a fallback
      try {
        window.dispatchEvent(new Event('booking:submitted'));
        localStorage.removeItem('bookingData');
        localStorage.removeItem('bookingStep');
        console.log('🧹 Booking wizard cache cleared after submit (Step 11)');
      } catch (e) {
        console.warn('Could not clear wizard cache:', e);
      }
    } catch (err: any) {
      console.error('❌ postRequest failed:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step">
      <h2 className="text-4xl font-bold text-center my-4">Showtime</h2>
      <div className="w-2/3 mx-auto mb-6 bg-white border border-gray-200 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Ihre Daten im Überblick</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
          <div>
            <dt className="font-medium">Event Typ</dt>
            <dd>{data.event_type}</dd>
          </div>
          <div>
            <dt className="font-medium">Show Typ</dt>
            <dd>{data.show_type}</dd>
          </div>
          <div>
            <dt className="font-medium">Disziplinen</dt>
            <dd>{data.disciplines.join(', ')}</dd>
          </div>
          <div>
            <dt className="font-medium">Teamgröße</dt>
            <dd>{data.team_size} </dd>
          </div>
          <div>
            <dt className="font-medium">Dauer</dt>
            <dd>{data.duration_minutes} Minuten</dd>
          </div>
          <div>
            <dt className="font-medium">Adresse</dt>
            <dd>{data.event_address}</dd>
          </div>
          <div>
            <dt className="font-medium">Ort</dt>
            <dd>{data.is_indoor ? 'Indoor' : 'Outdoor'}</dd>
          </div>
          <div>
            <dt className="font-medium">Datum & Uhrzeit</dt>
            <dd>{data.event_date} um {data.event_time}</dd>
          </div>
          <div>
            <dt className="font-medium">Gäste</dt>
            <dd>{data.number_of_guests}</dd>
          </div>
          <div>
            <dt className="font-medium">Planungsstatus</dt>
            <dd>{data.planning_status}</dd>
          </div>
          <div>
            <dt className="font-medium">Licht benötigt</dt>
            <dd>{data.needs_light ? 'Ja' : 'Nein'}</dd>
          </div>
          <div>
            <dt className="font-medium">Ton benötigt</dt>
            <dd>{data.needs_sound ? 'Ja' : 'Nein'}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-medium">Sonderwünsche</dt>
            <dd>{data.special_requests || '–'}</dd>
          </div>
          <div>
            <dt className="font-medium">Name</dt>
            <dd>{data.client_name}</dd>
          </div>
          <div>
            <dt className="font-medium">E-Mail</dt>
            <dd>{data.client_email}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-medium">Newsletter-Rabatt</dt>
            <dd>{data.newsletter_opt_in ? 'Ja (5% Rabatt)' : 'Nein'}</dd>
          </div>
        </dl>
      </div>
      <div className="navigation flex justify-center w-full mt-4">
        {!response ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow cursor-pointer hover:bg-sky-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Senden...
              </>
            ) : (
              'Absenden'
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg shadow cursor-pointer hover:bg-gray-600 transition-colors"
          >
            X
          </button>
        )}
      </div>
      {response && (
        <div ref={responseRef} className="relative w-2/3 mx-auto bg-white border border-gray-200 
        rounded-lg shadow mt-6 p-6">
          <h3 className="text-xl font-semibold mb-4">Anfrage erhalten!</h3>
          <p className="text-gray-700 leading-relaxed">
            Am {new Date(data.event_date).toLocaleDateString('de-DE')} haben wir 
            {" "}{response.num_available_artists} verfügbare{response.num_available_artists > 1 ? '' : 'n'} 
            {" "}Artist{response.num_available_artists > 1 ? 's' : ''} 
            {" "}für Ihren Event. Der Preis wird voraussichtlich zwischen 
            {" "}{response.price_min}€ und {response.price_max}€ 
            {" "}liegen. Ihre Anfrage geht nun an unsere Künstler raus 
            {" "}– innerhalb von 48 Stunden erhalten Sie ein gesammeltes Angebot.
          </p>
        </div>
      )}
      {error && (
        <div className="error" style={{ color: 'red', marginTop: '16px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default StepShowtime;