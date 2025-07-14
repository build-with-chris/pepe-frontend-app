

import React, { useState } from 'react';
import type { BookingData } from '../types';
import { postRequest } from '../../../services/bookingApi';

export interface StepShowtimeProps {
  data: BookingData;
  onPrev: () => void;
}

const StepShowtime: React.FC<StepShowtimeProps> = ({ data, onPrev }) => {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await postRequest(data);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step">
      <h2>Anfrage überprüfen & absenden</h2>
      <pre style={{ backgroundColor: '#f4f4f4', padding: '16px', borderRadius: '4px' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
      <div className="navigation" style={{ marginTop: '16px' }}>
        <button type="button" onClick={onPrev} disabled={loading}>
          Zurück
        </button>
        <button type="button" onClick={handleSubmit} disabled={loading} style={{ marginLeft: '8px' }}>
          {loading ? 'Senden...' : 'Absenden'}
        </button>
      </div>
      {response && (
        <div className="response" style={{ marginTop: '24px' }}>
          <h3>Server-Antwort:</h3>
          <pre style={{ backgroundColor: '#eef', padding: '16px', borderRadius: '4px' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
      {error && (
        <div className="error" style={{ color: 'red', marginTop: '16px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default StepShowtime;