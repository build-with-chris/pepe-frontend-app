


export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-20 px-6">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Datenschutzerklärung</h1>

        <p>
          Wir freuen uns über Ihr Interesse an unserer Website. Der Schutz Ihrer
          Privatsphäre ist uns sehr wichtig. Nachstehend informieren wir Sie ausführlich
          über den Umgang mit Ihren Daten.
        </p>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">1. Verantwortlicher</h2>
          <p>Heiduk & Hermann GbR PepeShows</p>
          <p>Maria-Montessori-Str. 4</p>
          <p>81829 München</p>
          <p>E-Mail: chris@pepearts.de</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">2. Erhebung und Speicherung personenbezogener Daten</h2>
          <p>
            Wir erheben personenbezogene Daten, wenn Sie uns diese im Rahmen Ihrer Anfrage,
            bei der Nutzung des Booking-Assistenten oder per E-Mail mitteilen. Diese Daten
            verwenden wir ausschließlich zur Bearbeitung Ihrer Anfrage und Durchführung
            unserer Dienstleistungen.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">3. Weitergabe von Daten</h2>
          <p>
            Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, soweit dies zur
            Vertragserfüllung notwendig ist (z. B. an Künstler:innen, die für Ihre
            Veranstaltung gebucht werden) oder wir gesetzlich dazu verpflichtet sind.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">4. Cookies & Analyse</h2>
          <p>
            Unsere Website verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern.
            Außerdem nutzen wir ggf. Analyse-Tools (z. B. Google Analytics), um das
            Nutzungsverhalten auszuwerten. Sie können die Speicherung von Cookies jederzeit
            in Ihrem Browser deaktivieren.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">5. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
            Verarbeitung Ihrer Daten sowie das Recht auf Datenübertragbarkeit. Zudem können
            Sie der Verarbeitung jederzeit widersprechen.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">6. Kontakt für Datenschutzanfragen</h2>
          <p>
            Wenn Sie Fragen zum Datenschutz haben oder Ihre Rechte ausüben möchten,
            kontaktieren Sie uns bitte unter: chris@pepearts.de
          </p>
        </div>

        <p className="text-sm text-gray-400 pt-6">
          Stand: {new Date().toLocaleDateString("de-DE")}
        </p>
      </div>
    </div>
  )
}