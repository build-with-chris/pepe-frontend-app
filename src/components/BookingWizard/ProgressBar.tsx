import React from 'react';
import { progressSteps } from './progressSteps';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProgressBarProps {
  stepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
}) => {
  // Calculate which image to show based on current step
  const frame = Math.floor(
    (stepIndex / (totalSteps - 1)) * (progressSteps.length - 1)
  );
  const clampedFrame = Math.max(
    0,
    Math.min(progressSteps.length - 1, frame)
  );
  const src = progressSteps[clampedFrame];

  return (
    <div className="w-4/5 mx-auto flex items-center justify-center my-4 space-x-4">
      <h2 className="text-lg font-semibold whitespace-nowrap">
        Schritt {stepIndex + 1} von {totalSteps}
      </h2>
      <img
        src={src}
        alt={`Schritt ${stepIndex + 1} von ${totalSteps}`}
        className="w-4/5 max-w-none"
      />
      <div className="flex space-x-4 mt-2">
        <Button
          variant="secondary"
          onClick={onPrev}
          disabled={stepIndex === 0}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="ml-2 hidden md:inline">Zurück</span>
        </Button>
        <Button
          variant="secondary"
          onClick={onNext}
          disabled={stepIndex === totalSteps - 1}
        >
          <span className="mr-2 hidden md:inline">Weiter</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProgressBar;