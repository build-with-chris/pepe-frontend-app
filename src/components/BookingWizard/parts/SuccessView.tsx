

import React from 'react';
import { useTranslation } from 'react-i18next';

interface SuccessViewProps {
  onReset: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ onReset }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-bold mb-4">{t('booking.showtime.success.heading')}</h2>
      <p className="text-lg text-center mb-6 max-w-xl">
        {t('booking.showtime.success.message')}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
      >
        {t('booking.showtime.success.reset')}
      </button>
    </div>
  );
};

export default SuccessView;