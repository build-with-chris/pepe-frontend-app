import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Rechnungen() {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      // Vollständiges JWT in der Konsole ausgeben
      // Hinweis: Token enthält sensible Daten – nur in Dev-Umgebungen loggen!
      console.log('[Invoices] JWT token:', token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1] || ''));
        console.log('[Invoices] JWT payload (decoded):', payload);
      } catch (e) {
        // Ignoriere Decode-Fehler (z. B. bei nicht-standardisierten Tokens)
      }
    } else {
      console.log('[Invoices] Kein JWT vorhanden');
    }
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Rechnungen (Admin)</h1>
      <p className="text-white/70 mt-2">(Debug) Das JWT wurde in der Browser-Konsole ausgegeben.</p>
    </div>
  );
}
