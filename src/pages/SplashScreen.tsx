import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);

  // Nach 3 Sekunden den Prompt zum Drücken von Enter anzeigen
  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Sobald der Prompt sichtbar ist, auf Enter-Taste hören und zur Startseite navigieren
  useEffect(() => {
    if (!showPrompt) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        navigate('/home');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPrompt, navigate]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <iframe
        className="absolute inset-0 w-full h-full object-cover"
        src="https://www.youtube.com/embed/dXHLaIkezTM?autoplay=1&mute=1&loop=1&playlist=dXHLaIkezTM&controls=0&modestbranding=1"
        frameBorder="0"
        allow="autoplay; fullscreen"
      />
      {showPrompt && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-3xl md:text-5xl animate-pulse">
            Drücke Enter
          </span>
        </div>
      )}
    </div>
  );
}
