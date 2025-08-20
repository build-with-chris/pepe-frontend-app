import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";

import {InstagramIcon} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const mainLinks = [
  { title: "Mediamaterial", href: "/mediamaterial" },
  { title: "Shows & Formate", href: "/shows&formate" },
  { title: "Referenzen", href: "/referenzen" },
  { title: "FAQ", href: "/faq" },
  { title: "Agentur & Team", href: "/agentur" },
  { title: "Kontakt", href: "/kontakt" },
  { title: "Artist Log-in", href: "/login" },
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
      <div className="max-w-screen-2xl mx-auto px-6 xl:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Navigation */}
          <nav aria-label="Footer" className="md:col-span-7 lg:col-span-8 grid grid-cols-2 gap-6">
            <div>
              <h6 className="mb-3 text-xs uppercase tracking-wider text-white/60">Navigation</h6>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mainLinks.map(({ title, href }) => (
                  <li key={title}>
                    <Link
                      to={href}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className={`${linkBase} ${linkMain} py-1`}
                    >
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
                    <Link
                      to={href}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className={`${linkBase} ${linkLegal} py-1`}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Right side: animation + logo/newsletter in one flexible container */}
          <div className="md:col-span-5 lg:col-span-4 xl:-ml-60 flex items-start md:gap-3 lg:gap-38 justify-start">
            {/* animation, hidden on mobile, slight top offset to align visually */}
            <div className="hidden md:block shrink-0 mt-1 md:w-16 md:h-16 lg:w-20 lg:h-20">
              <DotLottieReact
                src="https://lottie.host/624aabe7-916a-416f-b6c2-be3a17f113f9/DyPtBBmqU4.lottie"
                loop
                autoplay
                style={{ width: "100%", height: "100%,", filter: "invert(1) brightness(2)" }}
              />
            </div>

            {/* rest fills remaining width */}
            <div className="flex-1 w-full min-w-0">
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
                <h6 className="font-semibold text-white/90">Newsletter</h6>
                <form className="mt-4 flex items-center gap-2 max-w-full">
                  <Input
                    type="email"
                    placeholder="Email hier eingeben"
                    className="w-40 sm:w-56 md:w-64 lg:w-72 xl:w-80 min-w-0 bg-white text-black placeholder:text-black/60"
                  />
                  <Button type="button" className="shrink-0">Anmelden</Button>
                </form>
              </div>
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