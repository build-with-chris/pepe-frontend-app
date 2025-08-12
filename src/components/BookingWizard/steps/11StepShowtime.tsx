import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { BookingData } from '../types';
import { postRequest } from '../../../services/bookingApi';
import { Loader2, CalendarDays, Users, Clock, MapPin, Info, Music, Mic, Lightbulb, ListChecks, User, Mail, Gift, Star, PartyPopper, CheckCircle2 } from 'lucide-react';
import InfoBox from '../Infobox';

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
    <div className="step pb-28">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">Fast geschafft – sollen wir deine Anfrage jetzt an unsere Künstler senden?</h2>
      <InfoBox
        title="Was passiert als nächstes"
        text={
          <>
            Beim Klick auf <strong>Absenden</strong> geht deine Anfrage unverbindlich an unsere Künstler. 
            Du erhältst innerhalb von 48 Stunden passende Angebote.
          </>
        }
      />
      <div className="w-full max-w-2xl mx-auto mb-6 bg-white border border-gray-200 rounded-lg shadow p-5 sm:p-6 break-words">
        <h3 className="text-xl font-semibold mb-4">Ihre Daten im Überblick</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 break-words">
          <div>
            <dt className="font-semibold flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600" /> Event Typ</dt>
            <dd>{data.event_type}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600" /> Show Typ</dt>
            <dd>{data.show_type}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><ListChecks className="h-4 w-4 text-blue-600" /> Disziplinen</dt>
            <dd>{data.disciplines.join(', ')}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" /> Anreisende Künstler</dt>
            <dd>{data.team_size} </dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-blue-600" /> Dauer</dt>
            <dd>{data.duration_minutes} Minuten</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> Adresse</dt>
            <dd>{data.event_address}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> Ort</dt>
            <dd>{data.is_indoor ? 'Indoor' : 'Outdoor'}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-blue-600" /> Datum & Uhrzeit</dt>
            <dd>{data.event_date} um {data.event_time}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" /> Gäste</dt>
            <dd>{data.number_of_guests}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-blue-600" /> Planungsstatus</dt>
            <dd>{data.planning_status}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-blue-600" /> Licht benötigt</dt>
            <dd>{data.needs_light ? 'Ja' : 'Nein'}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Mic className="h-4 w-4 text-blue-600" /> Ton benötigt</dt>
            <dd>{data.needs_sound ? 'Ja' : 'Nein'}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-blue-600" /> Sonderwünsche</dt>
            <dd>{data.special_requests || '–'}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-blue-600" /> Name</dt>
            <dd>{data.client_name}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" /> E-Mail</dt>
            <dd className="break-all">{data.client_email}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold flex items-center gap-2"><Gift className="h-4 w-4 text-blue-600" /> Newsletter-Rabatt</dt>
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
        ) : null}
      </div>
      {response && (
        <div ref={responseRef} className="relative w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl mt-8 p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 text-green-600 mb-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Anfrage versendet  🎉</span>
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2 flex items-center gap-2">
              Vielen Dank für deine Anfrage
            </h3>
            <p className="text-sm md:text-base text-gray-600 max-w-md">
              Deine Anfrage wurde erfolgreich versendet. Schau dich in der Zwischenzeit gern bei unseren Kü nstlern um und entdecke weitere spannende Acts.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
              <div className="text-xs text-gray-500">Verfügbare Artisten</div>
              <div className="text-xl font-bold text-blue-700">{response.num_available_artists}</div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
              <div className="text-xs text-gray-500">Voraussichtlicher Preis</div>
              <div className="text-xl font-bold text-blue-700">{response.price_min}€ – {response.price_max}€</div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
              <div className="text-xs text-gray-500">Gebündeltes Angebot</div>
              <div className="text-xl font-bold text-blue-700">in 48h per Mail</div>
            </div>
          </div>

          {/* Link */}
          <div className="text-center mt-6">
            <a
              href="/kuenstler"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-colors"
            >
              <PartyPopper className="h-5 w-5" />
              Zu unseren Künstlern
            </a>
          </div>
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