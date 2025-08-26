import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { BookingData } from '../types';
import { postRequest } from '../../../services/bookingApi';
import { Loader2, CalendarDays, Users, Clock, MapPin, Info, Music, Mic, Lightbulb, ListChecks, User, Mail, Gift, Star, PartyPopper, CheckCircle2 } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTranslation } from "react-i18next";
import SummaryCard from '../parts/SummaryCard';

const ANIM_DURATION = 800; // ms
const CONFETTI_COUNT = 100;
const MIN_DELAY = 5000;

const DISCIPLINE_VIDEO_MAP: Record<string, string> = {
  "led cyr": "LED CYR Blackbox.webm",
  "cyr": "Cyr 5.webm",
  "pantom": "Pantomime.webm",
  "akro": "Contortion.webm",
  "contortion": "Contortion.webm",
  "hula": "Hula.webm",
  "handstand": "Handstand.webm",
  "chinese": "Chienise Pole.webm",
  "pole": "Chienise Pole.webm"
};

const extractCity = (address: string): string => {
  if (!address) return "";
  const parts = address.split(",").map(s => s.trim());
  return parts[1] || parts[0] || "";
};
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

  const [animArtists, setAnimArtists] = useState<number>(0);
  const [animPriceMin, setAnimPriceMin] = useState<number>(0);
  const [animPriceMax, setAnimPriceMax] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showReplay, setShowReplay] = useState(false);

  const isGroup = Number(data.team_size) === 3;

  // Pick a short cinematic loop based on discipline/show type
  const pickVideoFile = () => {
    const primary = (Array.isArray(data.disciplines) && data.disciplines[0]) || data.show_type || '';
    const key = String(primary).toLowerCase();
    for (const k of Object.keys(DISCIPLINE_VIDEO_MAP)) {
      if (key.includes(k)) return DISCIPLINE_VIDEO_MAP[k];
    }
    return 'Vorschau loop.webm';
  };
  const visualSrc = encodeURI(`/videos/Short Clips/${pickVideoFile()}`);

  // Map Gästezahl (intern evtl. 199 / 350 / 501) auf verständliche Buckets für die Anzeige
  const guestsValue = Number(data.number_of_guests);
  const guestsLabel = isNaN(guestsValue)
    ? String(data.number_of_guests ?? "")
    : guestsValue >= 501
      ? ">500"
      : guestsValue >= 200
        ? "200–500"
        : "<200";

  // Derive city from address (best-effort)
  const city = extractCity(data.event_address || "");
  const showTypeLabel = String(data.show_type || '').trim();

  // Staggered reveal for waiting lines
  const [showL1, setShowL1] = useState(true);
  const [showL2, setShowL2] = useState(false);
  const [showL3, setShowL3] = useState(false);

  useEffect(() => {
    if (showAnim) {
      setShowL1(true);
      const t2 = setTimeout(() => setShowL2(true), 900);
      const t3 = setTimeout(() => setShowL3(true), 1800);
      return () => {
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setShowL1(true);
      setShowL2(false);
      setShowL3(false);
    }
  }, [showAnim]);

  useEffect(() => {
    if (responseRef.current && response) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
      confetti({
        particleCount: CONFETTI_COUNT,
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
      try {
        localStorage.setItem('bookingData', JSON.stringify(data));
        console.log('💾 bookingData cached at submit (Step 11)');
      } catch (e) {
        console.warn('Could not cache bookingData at submit:', e);
      }
      const res = await postRequest(data);
      setPendingResponse(res);

      // ensure at least MIN_DELAY delay
      const elapsed = Date.now() - startTime;
      const waitTime = elapsed < MIN_DELAY ? MIN_DELAY - elapsed : 0;
      setTimeout(() => {
        setResponse(res);
        try {
          const duration = ANIM_DURATION; // ms
          const start = performance.now();
          const fromArtists = 0;
          const toArtists = Number(res?.num_available_artists || 0);
          const fromMin = 0;
          const toMin = Number(res?.price_min || 0);
          const fromMax = 0;
          const toMax = Number(res?.price_max || 0);

          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const ease = t * (2 - t); // easeOutQuad
            setAnimArtists(Math.round(fromArtists + (toArtists - fromArtists) * ease));
            setAnimPriceMin(Math.round(fromMin + (toMin - fromMin) * ease));
            setAnimPriceMax(Math.round(fromMax + (toMax - fromMax) * ease));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        } catch {}
        // 👉 Notify the wizard to clear its cached data and also clear here as a fallback
        try {
          window.dispatchEvent(new Event('booking:submitted'));
          console.log('ℹ️ bookingData preserved for reuse (Step 11)');
        } catch (e) {
          console.warn('Could not notify booking submitted:', e);
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

      <SummaryCard data={data} />

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
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[1000] bg-black/60 backdrop-blur-sm text-center px-4">
          <DotLottieReact
            src="https://lottie.host/f1618824-5547-4c31-80af-8c201d095f8c/klnukhE8Er.lottie"
            loop
            autoplay
            style={{ width: 120, height: 120 }}
          />
          <div className="mt-6 text-white font-medium text-lg max-w-md">
            <p className={`transition-all duration-500 ${showL1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
              {t('booking.showtime.waiting.line1', { defaultValue: 'Ich spüre schon, wie es aussehen wird…' })}
            </p>
            <p className={`transition-all duration-500 ${showL2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
              {t('booking.showtime.waiting.line2', {
                defaultValue: '{{guests}} Gäste in {{city}} – {{showType}}. Man spürt das Kribbeln.',
                guests: guestsLabel,
                city,
                showType: showTypeLabel
              })}
            </p>
            <p className={`transition-all duration-500 ${showL3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
              {t('booking.showtime.waiting.line3', {
                defaultValue: 'Gleich zeigen wir dir, was sich für euch richtig anfühlt.',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onPrev}
            className="mt-6 text-sm text-white/80 hover:text-white underline underline-offset-4"
          >
            {t('booking.showtime.actions.backOne', { defaultValue: 'Einen Schritt zurück' })}
          </button>
        </div>
      )}
      {response && !showAnim && (
        <div ref={responseRef} className="relative w-full max-w-2xl mx-auto bg-stone-50 border border-gray-200 rounded-2xl shadow-xl mt-8 p-8">
          {/* Badge */}
          <div className="text-center mb-2">
            <span className="inline-flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">{t('booking.showtime.success.badge')}</span>
            </span>
          </div>

          {/* Emotion (text only) */}
          <div className="mt-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2 text-black">
              {t('booking.showtime.emotion.headline', {
                defaultValue: 'Wow {{name}}, euer Event wird unvergesslich!',
                name: data.client_name || ''
              })}
            </h3>
            <p className="text-sm md:text-base text-gray-600 max-w-md">
              {t('booking.showtime.emotion.subline', {
                defaultValue: '{{guests}} Gäste • {{showType}} • {{date}} um {{time}}',
                guests: guestsLabel,
                showType: String(data.show_type || ''),
                date: String(data.event_date || ''),
                time: String(data.event_time || '')
              })}
            </p>
            {isGroup ? (
              <p className="text-xs md:text-sm text-gray-500 max-w-md mt-3">
                {t('booking.showtime.success.groupNote')}
              </p>
            ) : (
              <p className="text-xs md:text-sm text-gray-500 max-w-md mt-3">
                {t('booking.showtime.success.note')}
              </p>
            )}
          </div>

          {/* Large cinematic video (plays once, then shows replay) */}
          <div className="mt-5 -mx-2 sm:mx-0">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-black aspect-video">
              <video
                key={visualSrc}
                ref={videoRef}
                src={visualSrc}
                muted
                playsInline
                autoPlay
                className="w-full h-full object-cover"
                aria-label={t('booking.showtime.visual.alt', { defaultValue: 'Stimmungsclip passend zum Event' })}
                onEnded={() => setShowReplay(true)}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10"></div>
              {showReplay && (
                <button
                  type="button"
                  onClick={() => { setShowReplay(false); videoRef.current?.play?.(); }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm md:text-base"
                >
                  ↺ {t('booking.showtime.visual.replay', { defaultValue: 'Noch mal ansehen' })}
                </button>
              )}
            </div>
          </div>

          {/* Highlights with count-up */}
          {!isGroup && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
                <div className="text-xs text-gray-500">{t('booking.showtime.success.highlights.available')}</div>
                <div className="text-xl font-bold text-blue-700">
                  {animArtists}
                </div>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
                <div className="text-xs text-gray-500">{t('booking.showtime.success.highlights.price')}</div>
                <div className="text-xl font-bold text-blue-700">
                  {animPriceMin}€ – {animPriceMax}€
                </div>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
                <div className="text-xs text-gray-500">{t('booking.showtime.success.highlights.bundle')}</div>
                <div className="text-xl font-bold text-blue-700">{t('booking.showtime.success.highlights.bundleValue')}</div>
              </div>
            </div>
          )}

          {/* Human touch: curator */}
          <div className="mt-6 flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4">
            <img src="public/images/Team/Chris.webp" alt="Chris" className="w-12 h-12 rounded-full object-cover" />
            <p className="text-sm text-gray-700">
              {t('booking.showtime.emotion.curator', {
                defaultValue: '{{name}} prüft deine Anfrage und meldet sich innerhalb von 48 Stunden.',
                name: 'Chris'
              })}
            </p>
          </div>

          {/* Optional: mini timeline */}
          <div className="mt-6 text-xs md:text-sm text-gray-500">
            <ul className="space-y-1">
              <li>📩 {t('booking.showtime.timeline.received', { defaultValue: 'Heute: Anfrage eingegangen' })}</li>
              <li>⏱️ {t('booking.showtime.timeline.inbox', { defaultValue: '<48h: Vorschläge im Postfach' })}</li>
              <li>🔥 {t('booking.showtime.timeline.showtime', { defaultValue: 'Event: Showtime' })}</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center mt-6">
            <a
              href="/kuenstler"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-colors"
            >
              <PartyPopper className="h-5 w-5" />
              {t('booking.showtime.success.ctaArtists')}
            </a>
          </div>
          <div className="mt-3 flex items-center justify-center">
            <button
              type="button"
              onClick={onPrev}
              className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4"
            >
              {t('booking.showtime.actions.backOne', { defaultValue: 'Einen Schritt zurück' })}
            </button>
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