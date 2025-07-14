

import React from 'react';
import { progressSteps } from './progressSteps';

interface ProgressBarProps {
  stepIndex: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ stepIndex, totalSteps }) => {
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
    <div className="w-full flex justify-center my-4">
      <img
        src={src}
        alt={`Schritt ${stepIndex + 1} von ${totalSteps}`}
        className="w-2/3 max-w-none"
      />
    </div>
  );
};

export default ProgressBar;