import React from "react";

export type ProfileStatus = 'approved' | 'pending' | 'rejected' | 'unsubmitted';

export interface ProfileStatusBannerProps {
  status: ProfileStatus;
  rejectionReason?: string | null;
  className?: string;
}

export function ProfileStatusBanner({ status, rejectionReason, className }: ProfileStatusBannerProps) {
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
          Dein Profil ist <strong>zur Prüfung eingereicht</strong>. Ein Admin schaut es sich zeitnah an. Solange es nicht freigegeben ist, wirst du nicht als Künstler gelistet und erhältst keine Anfragen.
        </p>
      )}

      {status === 'rejected' && (
        <div>
          <p className="font-semibold">Dein Profil wurde leider abgelehnt.</p>
          {rejectionReason && (
            <p className="mt-1">
              <span className="font-medium">Grund:</span> {rejectionReason}
            </p>
          )}
          <p className="mt-2">Passe dein Profil an und reiche es erneut ein.</p>
        </div>
      )}

      {status === 'unsubmitted' && (
        <p>
          Reiche dein Profil zur <strong>Freigabe</strong> ein. Erst nach Freigabe wirst du auf der Künstlerseite angezeigt und kannst Anfragen erhalten.
        </p>
      )}
    </div>
  );
}
