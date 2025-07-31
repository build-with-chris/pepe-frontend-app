const BASE_URL = 'https://pepe-backend-4nid.onrender.com/api'

export interface AvailabilitySlot {
  id: number;
  date: string;
}

// Alle vorhandenen Slots des eingeloggten Artists holen
export async function getAvailability(): Promise<AvailabilitySlot[]> {
  const res = await fetch(`${BASE_URL}/availability`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
  
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Fehler beim Laden der Verfügbarkeit (${res.status}): ${err}`);
  }
  return res.json();
}

// Einen oder mehrere neue Slots anlegen
export async function addAvailability(
  slots: { date: string }[] 
): Promise<AvailabilitySlot[]> {
  const res = await fetch(`${BASE_URL}/availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${yourAccessToken}`
    },
    body: JSON.stringify(slots),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Fehler beim Speichern der Verfügbarkeit (${res.status}): ${err}`);
  }
  return res.json();
}

// Einzelnen Slot löschen
export async function removeAvailability(slotId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/availability/${slotId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${yourAccessToken}`
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Fehler beim Löschen der Verfügbarkeit (${res.status}): ${err}`);
  }
}