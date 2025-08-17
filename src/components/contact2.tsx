import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Contact2Props {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  web?: { label: string; url: string };
}

const Contact2 = ({
  title = "Kontakt",
  description = "Wir sind für Fragen, Feedback oder Kooperationsmöglichkeiten erreichbar. Lass uns wissen, wie wir helfen können!",
  phone = "(0159) 04891419",
  email = "info@pepearts.de",
  web = { label: "pepeshows.de", url: "https://pepeshows.de" },
}: Contact2Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
            <div className="text-center lg:text-left">
              <h1 className="mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl">
                {title}
              </h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="mx-auto w-fit lg:mx-0">
              <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left">
                Kontaktdaten
              </h3>
              <ul className="ml-4 list-disc">
                <li>
                  <span className="font-bold">Telefon: </span>
                  {phone}
                </li>
                <li>
                  <span className="font-bold">E-Mail: </span>
                  <a href={`mailto:${email}`} className="underline">
                    {email}
                  </a>
                </li>
                <li>
                  <span className="font-bold">Webseite: </span>
                  <a href={web.url} target="_blank" className="underline">
                    {web.label}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-lg border p-10">
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstname">Vorname</Label>
                <Input type="text" id="firstname" placeholder="Vorname" />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastname">Nachname</Label>
                <Input type="text" id="lastname" placeholder="Nachname" />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">E-Mail</Label>
              <Input type="email" id="email" placeholder="E-Mail" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">Betreff</Label>
              <Input type="text" id="subject" placeholder="Betreff" />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Nachricht</Label>
              <Textarea placeholder="Schreibe deine Nachricht hier." id="message" />
            </div>
            <Button className="w-full">Nachricht senden</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Contact2 };
