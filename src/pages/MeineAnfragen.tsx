import React from 'react';

const MeineAnfragen: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>📨 Meine Anfragen</h1>
      <p>Hier findest du deine eingegangenen Anfragen. Noch ist es ruhig, aber das wird sich bald ändern!</p>
      <ul>
        <li>🤹 Anfrage für Straßenfest in München</li>
        <li>🎪 Anfrage für Firmenfeier in Stuttgart</li>
        <li>🎉 Anfrage für Geburtstag in Leipzig</li>
      </ul>
    </div>
  );
};

export default MeineAnfragen;