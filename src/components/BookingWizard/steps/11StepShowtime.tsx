import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { BookingData } from '../types';
import { postRequest } from '../../../services/bookingApi';
import { Loader2 } from 'lucide-react';
import { useTranslation } from "react-i18next";
import SummaryCard from '../parts/SummaryCard';
import WaitingOverlay from '../parts/WaitingOverlay';
import SuccessView from '../parts/SuccessView';

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
        <WaitingOverlay
          message={t('booking.showtime.waiting.line1', { defaultValue: 'Ich spüre schon, wie es aussehen wird…' })}
          onBack={onPrev}
        />
      )}
      
      {response && !showAnim && (
        <SuccessView
          responseRef={responseRef}
          data={data}
          visualSrc={visualSrc}
          isGroup={isGroup}
          animArtists={animArtists}
          animPriceMin={animPriceMin}
          animPriceMax={animPriceMax}
          showReplay={showReplay}
          setShowReplay={setShowReplay}
          onPrev={onPrev}
        />
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