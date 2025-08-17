import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";

import {InstagramIcon} from "lucide-react";

const mainLinks = [
  { title: "Mediamaterial", href: "/mediamaterial" },
  { title: "Shows & Formate", href: "/shows&formate" },
  { title: "Buchen", href: "/anfragen" },
  { title: "Referenzen", href: "/referenzen" },
  { title: "FAQ", href: "/faq" },
  { title: "Agentur & Team", href: "/agentur" },
  { title: "Kontakt", href: "/kontakt" },
];

const legalLinks = [
  { title: "Impressum", href: "/impressum" },
  { title: "Datenschutz", href: "/datenschutz" },
  { title: "AGB", href: "/agb" },
];

const linkBase =
  "inline-flex items-center transition-colors underline-offset-4";
const linkMain =
  "text-sm sm:text-base text-white/90 hover:text-white";
const linkLegal =
  "text-xs text-white/60 hover:text-white/80";

const Footer04Page = () => {
  return (
    <footer className="bg-black text-white/80">
      {/* Top */}
      <div className="max-w-screen-xl mx-auto px-6 xl:px-0 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation */}
          <nav aria-label="Footer" className="md:col-span-2 grid grid-cols-2 gap-6">
            <div>
              <h6 className="mb-3 text-xs uppercase tracking-wider text-white/60">Navigation</h6>
              <ul className="grid grid-cols-2 gap-2">
                {mainLinks.map(({ title, href }) => (
                  <li key={title}>
                    <Link to={href} className={`${linkBase} ${linkMain} py-1`}>
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6 className="mb-3 text-xs uppercase tracking-wider text-white/60">Rechtliches</h6>
              <ul className="space-y-2">
                {legalLinks.map(({ title, href }) => (
                  <li key={title}>
                    <Link to={href} className={`${linkBase} ${linkLegal} py-1`}>
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Logo + Social + Newsletter */}
          <div>
            <Link to="/" className="text-white text-xl font-semibold">
              PepeShows
            </Link>
            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              <li>
                <Link
                  to="https://www.instagram.com/pepe_arts/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 hover:text-white"
                >
                  <InstagramIcon className="h-5 w-5" />
                </Link>
              </li>
            </ul>
            <div className="mt-8 max-w-xs">
              <h6 className="font-semibold text-white/90">Angebote & Shows</h6>
              <form className="mt-4 flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Email hier eingeben"
                  className="bg-white text-black placeholder:text-black/60"
                />
                <Button type="button">Anmelden</Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/20" />

      {/* Bottom */}
      <div className="max-w-screen-xl mx-auto px-6 xl:px-0 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-white/60">
          &copy; {new Date().getFullYear()} PepeShows. All rights reserved.
        </span>
        <div className="flex items-center gap-5">
          <Link
            to="https://www.instagram.com/pepe_arts/"
            target="_blank"
            rel="noreferrer"
            className="text-white/70 hover:text-white"
          >
            <InstagramIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer04Page;