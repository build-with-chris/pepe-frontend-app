

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Users, PiggyBank, Gift } from 'lucide-react';
import type { BookingData } from '../types';
import CountUp from 'react-countup';

interface SuccessViewProps {
  responseRef: React.RefObject<HTMLDivElement | null>;
  data: BookingData;
  visualSrc: string;
  isGroup: boolean;
  animArtists: number;
  animPriceMin: number;
  animPriceMax: number;
  showReplay: boolean;
  setShowReplay: React.Dispatch<React.SetStateAction<boolean>>;
  onPrev: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({
  responseRef,
  data,
  visualSrc,
  isGroup,
  animArtists,
  animPriceMin,
  animPriceMax,
  showReplay,
  setShowReplay,
  onPrev,
}) => {
  const { t } = useTranslation();

  return (
    <div
      ref={responseRef}
      className="relative w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8"
    >
      {/* Badge */}
      <div className="text-center mb-2">
        <span className="inline-flex items-center gap-2 text-green-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold text-sm">
            {t('booking.showtime.success.badge')}
          </span>
        </span>
      </div>

      {/* Headline & Subline */}
      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-900">
        {t('booking.showtime.success.headline', { name: data.client_name })}
      </h3>
      <p className="text-center text-gray-600 mb-6">
        {t('booking.showtime.success.subline', {
          guests: data.number_of_guests,
          date: data.event_date,
          time: data.event_time,
          showType: data.show_type,
        })}
      </p>
      {isGroup ? (
        <p className="text-center text-gray-500 mb-4 text-sm">
          {t('booking.showtime.success.groupNote')}
        </p>
      ) : (
        <p className="text-center text-gray-500 mb-4 text-sm">
          {t('booking.showtime.success.note')}
        </p>
      )}

      {/* Video Preview */}
      <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
        <video
          key={visualSrc}
          src={visualSrc}
          muted
          playsInline
          autoPlay
          className="w-full h-full object-cover rounded-lg"
        />
        {showReplay && (
          <button
            type="button"
            onClick={() => setShowReplay(false)}
            className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full"
          >
            {t('booking.showtime.success.replay')}
          </button>
        )}
      </div>

      {/* Highlights */}
      {!isGroup && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-lg font-bold">
              <CountUp end={animArtists} duration={2.5} />
            </p>
            <p className="text-xs text-gray-500">
              {t('booking.showtime.success.available')}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
            <PiggyBank className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-lg font-bold">
              <CountUp end={animPriceMin} duration={2} /> -{' '}
              <CountUp end={animPriceMax} duration={2} />
            </p>
            <p className="text-xs text-gray-500">
              {t('booking.showtime.success.priceRange')}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
            <Gift className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-lg font-bold">+</p>
            <p className="text-xs text-gray-500">
              {t('booking.showtime.success.bundle')}
            </p>
          </div>
        </div>
      )}

      {/* Curator block */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src="/images/Team/Chris.webp"
          alt="Chris"
          className="w-12 h-12 rounded-full object-cover"
        />
        <p className="text-gray-700 text-sm">
          {t('booking.showtime.success.curatorNote')}
        </p>
      </div>

      {/* Timeline */}
      <ol className="relative border-s border-gray-200 mb-8">
        <li className="mb-6 ms-6">
          <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 rounded-full -start-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </span>
          <h4 className="font-semibold text-gray-900">
            {t('booking.showtime.timeline.received')}
          </h4>
          <p className="text-sm text-gray-500">
            {t('booking.showtime.timeline.receivedDesc')}
          </p>
        </li>
        <li className="mb-6 ms-6">
          <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4">
            <Users className="w-5 h-5 text-gray-600" />
          </span>
          <h4 className="font-semibold text-gray-900">
            {t('booking.showtime.timeline.suggestions')}
          </h4>
          <p className="text-sm text-gray-500">
            {t('booking.showtime.timeline.suggestionsDesc')}
          </p>
        </li>
        <li className="ms-6">
          <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4">
            <Gift className="w-5 h-5 text-gray-600" />
          </span>
          <h4 className="font-semibold text-gray-900">
            {t('booking.showtime.timeline.showtime')}
          </h4>
          <p className="text-sm text-gray-500">
            {t('booking.showtime.timeline.showtimeDesc')}
          </p>
        </li>
      </ol>

      {/* CTA + Back */}
      <div className="flex justify-between items-center">
        <a
          href="#artists"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors text-sm"
        >
          {t('booking.showtime.success.cta')}
        </a>
        <button
          type="button"
          onClick={onPrev}
          className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
        >
          {t('booking.showtime.actions.backOne')}
        </button>
      </div>
    </div>
  );
};

export default SuccessView;