import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const LOCALSTORAGE_KEY = "guidelinesAccepted";

interface GuidelinesModalProps {
  openInitially?: boolean; 
}

export default function GuidelinesModal({ openInitially }: GuidelinesModalProps) {
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const isAccepted = localStorage.getItem(LOCALSTORAGE_KEY) === "true";
    setOpen(openInitially ?? !isAccepted);
  }, [openInitially]);

  const accept = () => {
    localStorage.setItem(LOCALSTORAGE_KEY, "true");
    setOpen(false);
  };
  const later = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl sm:max-w-2xl text-left">
        <DialogHeader>
          <DialogTitle>Willkommen bei PepeShows 🎪</DialogTitle>
          <DialogDescription>
            Ein kurzer Überblick, wie die Plattform funktioniert – deine Rechte und unsere Standards.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md bg-white/5 border border-white/10 p-3 text-sm text-gray-200">
          <strong>Kurz gesagt:</strong> Fair, sicher, transparent. Du entscheidest über Anfragen &amp; Gagen,
          wir kümmern uns um Matching, Vertrag &amp; Support. Medien bleiben deine – wir nutzen sie nur zur Bewerbung.
          Bitte antworte innerhalb von <strong>24–48 h</strong> und beachte Sicherheits‑/Venue‑Regeln.
        </div>

        <ScrollArea className="max-h-[50vh] rounded-md border border-white/10 p-4 space-y-4">
          {/* … (deine Abschnitte wie schon gebaut) … */}
          <div className="text-xs text-gray-400">
            Vollständige Bedingungen: <a href="/artist-guidelines" className="underline">/artist‑guidelines</a>
          </div>
        </ScrollArea>

        <div className="flex items-start gap-3 pt-2">
          <Checkbox id="agree" checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} />
          <label htmlFor="agree" className="text-sm text-gray-200 select-none">
            Ich habe die Plattform‑Regeln gelesen und akzeptiere sie.
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={later}>Später lesen</Button>
          <Button onClick={accept} disabled={!checked}>Akzeptieren &amp; weiter</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}