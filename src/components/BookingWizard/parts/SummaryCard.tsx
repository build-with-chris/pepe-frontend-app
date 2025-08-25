

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { BookingData } from '../types';

interface SummaryCardProps {
  data: BookingData;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-md w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4">{t('booking.showtime.summary.heading')}</h3>
      <ul className="space-y-2 text-sm">
        {data.client_name && (
          <li>
            <strong>{t('booking.contact.name')}:</strong> {data.client_name}
          </li>
        )}
        {data.client_email && (
          <li>
            <strong>{t('booking.contact.email')}:</strong> {data.client_email}
          </li>
        )}
        {data.event_address && (
          <li>
            <strong>{t('booking.location.address')}:</strong> {data.event_address}
          </li>
        )}
        {data.event_date && (
          <li>
            <strong>{t('booking.dateTime.date')}:</strong> {data.event_date}
          </li>
        )}
        {data.event_time && (
          <li>
            <strong>{t('booking.dateTime.time')}:</strong> {data.event_time}
          </li>
        )}
        {data.number_of_guests && (
          <li>
            <strong>{t('booking.dateTime.guests.heading')}:</strong> {data.number_of_guests}
          </li>
        )}
        {data.disciplines && data.disciplines.length > 0 && (
          <li>
            <strong>{t('booking.disciplines.heading')}:</strong> {data.disciplines.join(', ')}
          </li>
        )}
        {data.duration_minutes && (
          <li>
            <strong>{t('booking.wishes.duration.heading')}:</strong> {data.duration_minutes} {t('booking.length.placeholderMinutes')}
          </li>
        )}
        {(data.needs_light || data.needs_sound) && (
          <li>
            <strong>{t('booking.wishes.heading')}:</strong>{' '}
            {[
              data.needs_light ? t('booking.wishes.needsLight') : null,
              data.needs_sound ? t('booking.wishes.needsSound') : null,
            ]
              .filter(Boolean)
              .join(', ')}
          </li>
        )}
      </ul>
    </div>
  );
};

export default SummaryCard;