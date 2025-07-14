

import React, { useState } from 'react';
import type { BookingData } from './types';
import StepEventType from './steps/1StepEventType';
import StepShowType from './steps/2StepShowType';
import StepShowDisciplines from './steps/5ShowDisciplines.tsx';
import StepArtistCount from './steps/3StepArtistCount';
import StepLengthOfShow from './steps/4StepLengthOfShow';
import StepLocation from './steps/6StepLocation';
import StepDateAndTime from './steps/7StepDateAndTime';
import StepNumberGuestsAndStatus from './steps/8StepNumberGuestsAndStatus';
import StepWishes from './steps/9StepWishes';
import StepContactDetails from './steps/10StepContactDetails';
import StepShowtime from './steps/11StepShowtime';

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
  const [data, setData] = useState<BookingData>({
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
  });

  const [stepIndex, setStepIndex] = useState(0);
  const CurrentStep = steps[stepIndex];

  const onNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const onPrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const onChange = (update: Partial<BookingData>) => {
    setData(prev => ({ ...prev, ...update }));
  };

  return (
    <div className="booking-wizard">
      <div className="progress">
        Schritt {stepIndex + 1} von {steps.length}
      </div>
      <CurrentStep
        data={data}
        onChange={onChange}
        onNext={onNext}
        onPrev={onPrev}
      />
    </div>
  );
};

export default BookingWizard;