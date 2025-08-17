


export default function Impressum() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-20 px-6">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Impressum</h1>
        
        <div className="space-y-2">
          <p><strong>Angaben gemäß § 5 TMG:</strong></p>
          <p>Heiduk & Hermann GbR PepeShows</p>
          <p>Maria-Montessori-Str. 4</p>
          <p>81829 München</p>
        </div>

        <div className="space-y-2">
          <p><strong>Vertreten durch:</strong></p>
          <p>Christoph Hermann und Michael Heiduk</p>
        </div>

        <div className="space-y-2">
          <p><strong>Kontakt:</strong></p>
          <p>Telefon: 0159 04891419</p>
          <p>E-Mail: chris@pepearts.de</p>
        </div>

        <div className="space-y-2">
          <p><strong>Rechtsform:</strong></p>
          <p>Gesellschaft bürgerlichen Rechts (GbR)</p>
        </div>

        <div className="space-y-2">
          <p><strong>Umsatzsteuer-ID:</strong></p>
          <p>nicht vorhanden</p>
        </div>

        <div className="pt-6 text-sm text-gray-400">
          <p>Inhaltlich Verantwortlicher gemäß § 18 Abs. 2 MStV: Christoph Hermann und Michael Heiduk</p>
        </div>
      </div>
    </div>
  )
}