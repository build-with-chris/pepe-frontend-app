

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { BookingData } from '../types';

import { CalendarDays, ListChecks, Users, Clock, MapPin, Lightbulb, Mic, Star, User as UserIcon, Mail } from 'lucide-react';

interface SummaryCardProps {
  data: BookingData;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 bg-white border border-gray-200/70 rounded-2xl shadow-sm p-5 sm:p-6 break-words">
    <h3 className="text-xl font-semibold mb-4 text-black ">{t('booking.showtime.summary.title')}</h3>
    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-stone-700 break-words">
      <div>
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.eventType')}</dt>
        <dd>{data.event_type}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.showType')}</dt>
        <dd>{data.show_type}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><ListChecks className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.disciplines')}</dt>
        <dd>{data.disciplines.join(', ')}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.teamSize')}</dt>
        <dd>{Number(data.team_size) === 3 ? 'Gruppe' : data.team_size}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><Clock className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.duration')}</dt>
        <dd>{data.duration_minutes}{' ' + t('booking.showtime.summary.minutes')}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.address')}</dt>
        <dd>{data.event_address}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.venueType')}</dt>
        <dd>{data.is_indoor ? t('booking.showtime.summary.indoor') : t('booking.showtime.summary.outdoor')}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><Clock className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.datetime')}</dt>
        <dd>{data.event_date}{' ' + t('booking.showtime.summary.at') + ' '}{data.event_time}</dd>
      </div>
      {data.needs_light && (
        <div>
          <dt className="font-semibold text-gray-800 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.light')}</dt>
          <dd>{t('common.yes')}</dd>
        </div>
      )}
      {data.needs_sound && (
        <div>
          <dt className="font-semibold text-gray-800 flex items-center gap-2"><Mic className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.sound')}</dt>
          <dd>{t('common.yes')}</dd>
        </div>
      )}
      <div className="md:col-span-2">
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><Star className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.special')}</dt>
        <dd>{data.special_requests || t('booking.showtime.summary.none')}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><UserIcon className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.name')}</dt>
        <dd>{data.client_name}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-800 flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" /> {t('booking.showtime.summary.labels.email')}</dt>
        <dd className="break-all">{data.client_email}</dd>
      </div>
    </dl>
  </div>
  )
}
export default SummaryCard;