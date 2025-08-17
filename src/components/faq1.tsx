import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Faq1Props {
  heading?: string;
  items?: FaqItem[];
}

const Faq1 = ({
  heading = "Frequently asked questions",
  items = [
    {
      id: "faq-1",
      question: "Welche Künstler und Shows bietet ihr an?",
      answer:
        "PepeShows bietet eine große Bandbreite an Disziplinen: Luftakrobatik, Cyr Wheel, Jonglage, Tanz, Breakdance, Feuerkunst, Comedy, Zauberei, Moderation, Walking Acts, Spezial-Acts und viele mehr. Unser Netzwerk ist europaweit aktiv und wächst ständig.",
    },
    {
      id: "faq-2",
      question: "Wie läuft eine Buchung ab?",
      answer:
        "Du kannst entweder direkt unseren Booking-Assistenten nutzen – er führt dich Schritt für Schritt durch die Anfrage und sendet sie direkt an die passenden Künstler. Oder du buchst für allgemeine Fragen und Beratung ganz einfach einen telefonischen Termin mit uns.",
    },
    {
      id: "faq-3",
      question: "Wie viel Vorlaufzeit brauche ich für eine Buchung?",
      answer:
        "Je nach Show empfehlen wir einige Wochen Vorlauf. Viele Acts sind jedoch auch kurzfristig buchbar. Am besten so früh wie möglich anfragen, damit wir die besten Optionen garantieren können.",
    },
    {
      id: "faq-4",
      question: "Welche Technik / Voraussetzungen werden benötigt?",
      answer:
        "Je nach Show gibt es unterschiedliche Anforderungen – etwa Bühnenhöhe und Rigging für Luftakrobatik oder Sicherheitsabstände für Feueracts. Licht- und Tonanlagen sind optional zubuchbar. Wir beraten dich individuell und kümmern uns bei Bedarf um die gesamte technische Umsetzung.",
    },
    {
      id: "faq-5",
      question: "Kann man Shows individuell anpassen?",
      answer:
        "Ja! Motto, Kostüm, Länge und Ablauf lassen sich individuell anpassen. Wir gestalten jede Performance maßgeschneidert für dein Event.",
    },
    {
      id: "faq-6",
      question: "Wie setzen sich die Preise zusammen?",
      answer:
        "Wir haben gemeinsam mit unseren Künstlern eine faire Preisbasis ausgehandelt. Die Gage richtet sich nach Art der Show, Aufwand, Anreise und Technik. Einfach den Booking-Assistenten durchgehen – dort wird dir direkt eine Preisrichtung angegeben.",
    },
    {
      id: "faq-7",
      question: "Gibt es Pauschalen oder nur individuelle Angebote?",
      answer:
        "Grundsätzlich erstellen wir individuelle Angebote, da jedes Event einzigartig ist. Über den Booking-Assistenten erhältst du jedoch sofort eine transparente Preisübersicht.",
    },
    {
      id: "faq-8",
      question: "Sind Reisekosten im Preis enthalten?",
      answer:
        "Ja, beim Booking-Assistenten siehst du den Komplettpreis inklusive Reisekosten. Es gibt keine versteckten Gebühren.",
    },
    {
      id: "faq-9",
      question: "Was macht euer Booking-Assistent?",
      answer:
        "In wenigen Minuten wirst du alle wichtigen Details zu deinem Event abgefragt – und hast dabei sogar noch Spaß! Am Ende erhältst du ein passendes Angebot mit Preisübersicht.",
    },
    {
      id: "faq-10",
      question: "Habe ich einen festen Ansprechpartner?",
      answer:
        "Ja, während des gesamten Prozesses betreut dich eine feste Bezugsperson. Wir koordinieren Künstler, Technik und Ablauf für dich.",
    },
    {
      id: "faq-11",
      question: "Unterstützt ihr auch bei größeren Events mit mehreren Acts?",
      answer:
        "Absolut! Wir übernehmen die komplette Showplanung – von der Auswahl über die Abstimmung bis hin zur Durchführung mehrerer Acts. So hast du ein rundum stimmiges Event aus einer Hand.",
    },
  ],
}: Faq1Props) => {
  return (
    <section className="py-32 bg-black text-white flex justify-center">
      <div className="w-full max-w-2xl px-4 text-center">
        <h1 className="mb-8 text-3xl font-bold md:mb-12 md:text-4xl">
          {heading}
        </h1>
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="font-semibold text-left hover:no-underline py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 text-left pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { Faq1 };
