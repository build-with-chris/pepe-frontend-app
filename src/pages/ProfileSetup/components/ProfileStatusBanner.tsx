import React from "react";
import { useTranslation } from "react-i18next";

export type ProfileStatus = 'approved' | 'pending' | 'rejected' | 'unsubmitted';

export interface ProfileStatusBannerProps {
  status: ProfileStatus;
  rejectionReason?: string | null;
  className?: string;
}

export function ProfileStatusBanner({ status, rejectionReason, className }: ProfileStatusBannerProps) {
  const { t } = useTranslation();

  if (status === 'approved') return null;

  const isRejected = status === 'rejected';
  const container = `${className ?? ''} rounded-lg border p-4 ${
    isRejected ? 'bg-red-50 border-red-300 text-red-800' : 'bg-amber-50 border-amber-300 text-amber-900'
  }`;

  return (
    <div
      className={container}
      role={isRejected ? 'alert' : 'status'}
      aria-live={isRejected ? 'assertive' : 'polite'}
    >
      {status === 'pending' && (
        <p>
          {t('profileStatusBanner.pending.info')}
        </p>
      )}

      {status === 'rejected' && (
        <div>
          <p className="font-semibold">{t('profileStatusBanner.rejected.title')}</p>
          {rejectionReason && (
            <p className="mt-1">
              {t('profileStatusBanner.rejected.reason', { reason: rejectionReason })}
            </p>
          )}
          <p className="mt-2">{t('profileStatusBanner.rejected.hint')}</p>
        </div>
      )}

      {status === 'unsubmitted' && (
        <p>
          {t('profileStatusBanner.unsubmitted.hint')}
        </p>
      )}
    </div>
  );
}
