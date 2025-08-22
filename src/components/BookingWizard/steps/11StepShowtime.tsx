import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { BookingData } from '../types';
import { postRequest } from '../../../services/bookingApi';
import { Loader2, CalendarDays, Users, Clock, MapPin, Info, Music, Mic, Lightbulb, ListChecks, User, Mail, Gift, Star, PartyPopper, CheckCircle2 } from 'lucide-react';
import InfoBox from '../Infobox';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTranslation } from "react-i18next";

export interface StepShowtimeProps {
  data: BookingData;
  onPrev: () => void;
}

const StepShowtime: React.FC<StepShowtimeProps> = ({ data, onPrev }) => {
  const responseRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const [response, setResponse] = useState<any>(null);
  const [pendingResponse, setPendingResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAnim, setShowAnim] = useState(false);

  const isGroup = Number(data.team_size) === 3;

  // Map Gästezahl (intern evtl. 199 / 350 / 501) auf verständliche Buckets für die Anzeige
  const guestsValue = Number(data.number_of_guests);
  const guestsLabel = isNaN(guestsValue)
    ? String(data.number_of_guests ?? "")
    : guestsValue >= 501
      ? ">500"
      : guestsValue >= 200
        ? "200–500"
        : "<200";

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
    setShowAnim(true);
    const startTime = Date.now();
    try {
      const res = await postRequest(data);
      setPendingResponse(res);

      // ensure at least 5 seconds delay
      const elapsed = Date.now() - startTime;
      const waitTime = elapsed < 5000 ? 5000 - elapsed : 0;
      setTimeout(() => {
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

        setShowAnim(false);
        setLoading(false);
      }, waitTime);
    } catch (err: any) {
      console.error('❌ postRequest failed:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setShowAnim(false);
      setLoading(false);
    }
  };

  return (
    <div className="step pb-28">
      <h2 className="text-3xl md:text-4xl text-center mb-3 font-extrabold">
        {t('booking.showtime.heading.line1')}
        <br />
        {t('booking.showtime.heading.line2')}
      </h2>
      <InfoBox
        title={t('booking.showtime.infobox.title')}
        text={
          <>
            {t('booking.showtime.infobox.body.part1')} <strong>{t('booking.showtime.infobox.body.submit')}</strong> {t('booking.showtime.infobox.body.part2')}
          </>
        }
      />
      <div className="w-full max-w-2xl mx-auto mb-6 bg-stone-50 border border-gray-200 rounded-lg shadow p-5 sm:p-6 break-words">
        <h3 className="text-xl font-semibold mb-4 text-black ">{t('booking.showtime.summary.title')}</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-stone-700 break-words">
          <div>
            <dt className="font-semibold flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.eventType')}</dt>
            <dd>{data.event_type}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.showType')}</dt>
            <dd>{data.show_type}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><ListChecks className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.disciplines')}</dt>
            <dd>{data.disciplines.join(', ')}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.teamSize')}</dt>
            <dd>{Number(data.team_size) === 3 ? 'Gruppe' : data.team_size}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.duration')}</dt>
            <dd>{data.duration_minutes}{' ' + t('booking.showtime.summary.minutes')}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.address')}</dt>
            <dd>{data.event_address}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.venueType')}</dt>
            <dd>{data.is_indoor ? t('booking.showtime.summary.indoor') : t('booking.showtime.summary.outdoor')}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.datetime')}</dt>
            <dd>{data.event_date}{' ' + t('booking.showtime.summary.at') + ' '}{data.event_time}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.guests')}</dt>
            <dd>{guestsLabel}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.planning')}</dt>
            <dd>{data.planning_status}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.light')}</dt>
            <dd>{data.needs_light ? t('common.yes') : t('common.no')}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Mic className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.sound')}</dt>
            <dd>{data.needs_sound ? t('common.yes') : t('common.no')}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.special')}</dt>
            <dd>{data.special_requests || t('booking.showtime.summary.none')}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.name')}</dt>
            <dd>{data.client_name}</dd>
          </div>
          <div>
            <dt className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.email')}</dt>
            <dd className="break-all">{data.client_email}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold flex items-center gap-2"><Gift className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.newsletter')}</dt>
            <dd>{data.newsletter_opt_in ? t('booking.showtime.summary.newsletterYes') : t('booking.showtime.summary.newsletterNo')}</dd>
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
                {t('booking.showtime.actions.sending')}
              </>
            ) : (
              t('booking.showtime.actions.submit')
            )}
          </button>
        ) : null}
      </div>
      {showAnim && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
          <DotLottieReact
            src="https://lottie.host/f1618824-5547-4c31-80af-8c201d095f8c/klnukhE8Er.lottie"
            loop
            autoplay
            style={{ width: 96, height: 96 }}
          />
        </div>
      )}
      {response && !showAnim && (
        <div ref={responseRef} className="relative w-full max-w-2xl mx-auto bg-stone-50 border border-gray-200 rounded-2xl shadow-xl mt-8 p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 text-green-600 mb-2">
              <CheckCircle2 className="h-5 w-5" /> 
              <span className="text-sm font-semibold uppercase tracking-wide">{t('booking.showtime.success.badge')}</span>
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2 flex items-center gap-2 text-black">
              {t('booking.showtime.success.title')}
            </h3>
            {isGroup ? (
              <p className="text-sm md:text-base text-gray-600 max-w-md">
                {t('booking.showtime.success.groupNote')}
              </p>
            ) : (
              <p className="text-sm md:text-base text-gray-600 max-w-md">
                {t('booking.showtime.success.note')}
              </p>
            )}
          </div>

          {/* Highlights */}
          {!isGroup && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
                <div className="text-xs text-gray-500">{t('booking.showtime.success.highlights.available')}</div>
                <div className="text-xl font-bold text-blue-700">{response.num_available_artists}</div>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
                <div className="text-xs text-gray-500">{t('booking.showtime.success.highlights.price')}</div>
                <div className="text-xl font-bold text-blue-700">{response.price_min}€ – {response.price_max}€</div>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
                <div className="text-xs text-gray-500">{t('booking.showtime.success.highlights.bundle')}</div>
                <div className="text-xl font-bold text-blue-700">{t('booking.showtime.success.highlights.bundleValue')}</div>
              </div>
            </div>
          )}

          {/* Link */}
          <div className="text-center mt-6">
            <a
              href="/kuenstler"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-colors"
            >
              <PartyPopper className="h-5 w-5" />
              {t('booking.showtime.success.ctaArtists')}
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