
import React, { useState, useEffect } from "react";
import { getAvailability } from '@/services/availabilityApi';
import type {AvailabilitySlot} from '@/services/availabilityApi';
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const blockedDates: Date[] = [
  new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
];

const CalendarPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

const [avail, setAvail] = useState<AvailabilitySlot[]>([]);
useEffect(() => {
    getAvailability().then(setAvail).catch(console.error)}, [])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Buchungskalender</h1>
      <DayPicker
        mode="range"
        selected={{ from: startDate, to: endDate }}
        onSelect={(range) => {
          setStartDate(range?.from || undefined);
          setEndDate(range?.to || undefined);
        }}
        numberOfMonths={2}
        disabled={blockedDates}
      />
    </div>
  );
};

export default CalendarPage;