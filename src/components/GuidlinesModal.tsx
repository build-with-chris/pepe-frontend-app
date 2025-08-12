import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const LOCALSTORAGE_KEY = "guidelinesAccepted";

const GuidlinesModal: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  // Zeig das Modal nur, wenn noch nicht akzeptiert
  React.useEffect(() => {
    const accepted = typeof window !== "undefined" && localStorage.getItem(LOCALSTORAGE_KEY) === "true";
    if (!accepted) setOpen(true);
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, "true");
    } catch {}
    setOpen(false);
  };

  const handleLater = () => {
    // nichts speichern -> erscheint beim nächsten Login erneut
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl sm:max-w-2xl text-left">
        <DialogHeader>
          <DialogTitle>Willkommen bei PepeShows 🎪</DialogTitle>
          <DialogDescription>
            Ein kurzer Überblick, wie die Plattform funktioniert – deine Rechte und unsere Standards.
          </DialogDescription>
        </DialogHeader>

        {/* TL;DR */}
        <div className="rounded-md bg-white/5 border border-white/10 p-3 text-sm text-gray-200">
          <strong>Kurz gesagt:</strong> Fair, sicher, transparent. Du entscheidest über Anfragen &amp; Gagen, wir kümmern uns
          um Matching, Vertrag &amp; Support. Medien bleiben deine – wir nutzen sie nur zur Bewerbung. Bitte antworte auf
          Anfragen innerhalb von <strong>24–48 h</strong> und halte Sicherheits‑/Venue‑Regeln ein.
        </div>

        {/* Volltext – scrollbar */}
        <ScrollArea className="max-h-[50vh] rounded-md border border-white/10 p-4 space-y-4">
          <section>
            <h4 className="font-semibold mb-1">So funktioniert’s</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
              <li><strong>Anfrage:</strong> Veranstalter nennen Datum, Ort, Rahmen.</li>
              <li><strong>Matching:</strong> Vorschläge nach Disziplin, Stil, Verfügbarkeit.</li>
              <li><strong>Angebot &amp; Zusage:</strong> Du setzt Konditionen, wir koordinieren Details.</li>
              <li><strong>Auftritt &amp; Abrechnung:</strong> Betreuung bis Abschluss &amp; Feedback.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold mb-1">Deine Rechte</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
              <li>Transparente Infos vor Zusage.</li>
              <li>Freie Annahme/Ablehnung von Anfragen.</li>
              <li>Eigene Gagen; wir helfen bei der Kalkulation.</li>
              <li>Du bearbeitest/löschst Profil, Medien, Links jederzeit.</li>
              <li>Schneller, persönlicher Support.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold mb-1">Unsere Standards</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
              <li>Zuverlässigkeit: Bestätigte Termine sind verbindlich.</li>
              <li>Antwortzeit: <strong>24–48 h</strong>.</li>
              <li>Professionalität &amp; Sicherheit (Rider, Venue‑Regeln).</li>
              <li>Fair Play: keine Umgehung vereinbarter Prozesse.</li>
              <li>Respekt &amp; Inklusion.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold mb-1">Honorar &amp; Gebühren</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
              <li>Gage + Reisekosten/Spesen transparent im Angebot.</li>
              <li>Service‑Fee separat ausgewiesen.</li>
              <li>Zahlung i. d. R. nach Auftritt; Anzahlung möglich.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold mb-1">Storno &amp; Ausfälle</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
              <li>Kundenseitig: Staffelung je nach Terminabstand.</li>
              <li>Artistenseitig: nur aus wichtigem Grund – Ersatzsuche durch uns.</li>
              <li>Höhere Gewalt: fairer Ausgleich nach Vertrag.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold mb-1">Medien &amp; Datenschutz</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
              <li>Deine Medien bleiben dein Eigentum.</li>
              <li>Nutzung durch uns nur zur Bewerbung von dir/der Plattform.</li>
              <li>Datenexport &amp; -löschung jederzeit möglich.</li>
            </ul>
          </section>
        </ScrollArea>

        {/* Zustimmung */}
        <div className="flex items-start gap-3 pt-2">
          <Checkbox id="agree" checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} />
          <label htmlFor="agree" className="text-sm text-gray-200 select-none">
            Ich habe die Plattform‑Regeln gelesen und akzeptiere sie.
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleLater}>
            Später lesen
          </Button>
          <Button onClick={handleAccept} disabled={!checked}>
            Akzeptieren &amp; weiter
          </Button>
        </div>

        {/* Optional: Link zur Langfassung */}
        <div className="text-xs text-gray-400">
          Vollständige Bedingungen: <a href="/artist-guidelines" className="underline">/artist‑guidelines</a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuidlinesModal;