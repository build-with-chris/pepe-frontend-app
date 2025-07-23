import React from 'react';

const artists = [
  {
    name: 'Max Mustermann',
    description: 'Ein Artist mit beeindruckender Cyr-Wheel-Technik und Bühnenpräsenz.',
    imageSrc: '/assets/artists/max.jpg',
  },
  {
    name: 'Anna Beispiel',
    description: 'Luftakrobatin, die ihre Kunst mit filigranen Bewegungen in schwindelerregender Höhe zeigt.',
    imageSrc: '/assets/artists/anna.jpg',
  },
  // Weitere Künstler hier hinzufügen...
];

export default function Kuenstler(){
    return (
      <div className="container mx-auto p-6 text-white">
        <section className="intro mb-12 space-y-4">
          <h1 className="text-4xl font-bold">Unsere Künstler</h1>
          <p>
            Unsere Künstler stammen aus renommierten Zirkusschulen in ganz Europa und jede:r präsentiert
            seine einzigartige Art, sich auf der Bühne zu zeigen.
          </p>
          <p>
            Unser Netzwerk erstreckt sich jedoch über die ganze Welt.
          </p>
          <p>
            Als Pepe Collective trainieren wir regelmäßig gemeinsam in München und sorgen für
            nahtlose Übergänge in unseren Darbietungen.
          </p>
          <p>
            Wenn du dir nicht sicher bist, ob unsere Künstler zu deinem Event passen, dann
            besuche uns einfach und lerne deinen Favoriten persönlich kennen.
          </p>
        </section>

        <section className="artist-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map(artist => (
            <div key={artist.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={artist.imageSrc}
                alt={artist.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2">{artist.name}</h2>
                <p className="text-gray-600">{artist.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    );
}