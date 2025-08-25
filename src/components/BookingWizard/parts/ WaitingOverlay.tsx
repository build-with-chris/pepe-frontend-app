import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface WaitingOverlayProps {
  messages?: string[];
}

const WaitingOverlay: React.FC<WaitingOverlayProps> = ({ messages }) => {
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!messages || messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000); // change every 3 seconds
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="mb-6">
        <DotLottieReact
          src="/animations/waiting.lottie.json"
          loop
          autoplay
          style={{ width: 96, height: 96 }}
        />
      </div>
      <div className="text-white text-lg text-center max-w-md">
        {messages && messages.length > 0 ? (
          <p key={currentIndex}>{messages[currentIndex]}</p>
        ) : (
          <p>{t('booking.showtime.waiting')}</p>
        )}
      </div>
    </div>
  );
};

export default WaitingOverlay;