import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import type { BookingData } from './types';
import Intro from './steps/0Intro.tsx'
import StepEventType from './steps/1StepEventType';
import StepShowType from './steps/2StepShowType';
import StepShowDisciplines from './steps/5ShowDisciplines.tsx';
import StepArtistCount from './steps/3StepArtistCount';
import StepLengthOfShow from './steps/4StepLengthOfShow';
import StepLocation from './steps/6StepLocation';
import StepDateAndTime from './steps/7StepDateAndTime';
import StepNumberGuestsAndStatus from './steps/8Status.tsx';
import StepWishes from './steps/9StepWishes';
import StepContactDetails from './steps/10StepContactDetails';
import StepShowtime from './steps/11StepShowtime';

// Intro is rendered separately (not part of steps)
const steps = [
  StepEventType,
  StepShowType,
  StepShowDisciplines,
  StepArtistCount,
  StepLengthOfShow,
  StepLocation,
  StepDateAndTime,
  StepNumberGuestsAndStatus,
  StepWishes,
  StepContactDetails,
  StepShowtime
];

const BookingWizard: React.FC = () => {
  // Load saved wizard state from localStorage or use defaults
  const savedData = localStorage.getItem('bookingData');
  const savedStep = localStorage.getItem('bookingStep');
  const initialData: BookingData = savedData
    ? JSON.parse(savedData)
    : {
        client_email: '',
        client_name: '',
        disciplines: [],
        distance_km: 0,
        duration_minutes: 0,
        event_address: '',
        event_date: '',
        event_time: '',
        event_type: '',
        show_type: '',
        is_indoor: false,
        needs_light: false,
        needs_sound: false,
        newsletter_opt_in: false,
        number_of_guests: 0,
        special_requests: '',
        team_size: 0,
        planning_status: ''
      };
  const initialStep = savedStep ? Number(savedStep) : 0;
  const [data, setData] = useState<BookingData>(initialData);
  const [stepIndex, setStepIndex] = useState<number>(initialStep);

  // Persist wizard data and step to localStorage
  useEffect(() => {
    localStorage.setItem('bookingData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('bookingStep', stepIndex.toString());
  }, [stepIndex]);
  const CurrentStep = steps[stepIndex - 1];

  const onNext = () => {
    // From Intro (0) -> first real step (1)
    if (stepIndex === 0) {
      setStepIndex(1);
      return;
    }
    // Advance within real steps
    if (stepIndex < steps.length) {
      setStepIndex(stepIndex + 1);
    }
  };

  const onPrev = () => {
    // From first real step back to Intro
    if (stepIndex === 1) {
      setStepIndex(0);
      return;
    }
    if (stepIndex > 1) {
      setStepIndex(stepIndex - 1);
    }
  };

  const onChange = (update: Partial<BookingData>) => {
    setData(prev => ({ ...prev, ...update }));
  };

  return (
    <div className="p-5 relative">
    {stepIndex > 0 && (
      <ProgressBar
        stepIndex={stepIndex - 1}
        totalSteps={steps.length}
        onPrev={onPrev}
        onNext={onNext}
      />
    )}
      {stepIndex === 0 ? (
        <Intro
          data={data}
          onChange={onChange}
          onNext={onNext}
          onPrev={onPrev}
          onStart={() => setStepIndex(1)}
        />
      ) : (
        <CurrentStep
          data={data}
          onChange={onChange}
          onNext={onNext}
          onPrev={onPrev}
        />
      )}
      
    </div>
  );
};

export default BookingWizard;