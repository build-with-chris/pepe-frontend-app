import { Button } from "@/components/ui/button";

const Hero27 = () => {
  return (
    <section className="relative -mt-3 md:-mt-6 overflow-hidden bg-black text-white py-20">
      {/* Top fade into previous section */}
      <div className="pointer-events-none absolute -top-16 inset-x-0 h-20 bg-gradient-to-t from-black/0 to-black/70" />

      {/* Subtle color accents that gently overlap upwards */}
      <div className="pointer-events-none absolute -top-10 right-1/4 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-6 left-1/5 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
      <div className="container mx-auto w-full md:w-4/5 px-4">
        <div className="mx-auto flex flex-col items-center text-center gap-6">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight tracking-tight [text-wrap:balance]">
            Wir bringen <span className="font-bold text-white/90">außergewöhnliche Künstler</span> und <span className="font-bold text-white/90">unvergessliche Showmomente</span> auf Ihre Bühne.
          </h1>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            Ob Firmenfeier, Gala oder Messe – mit uns wird Ihr Event zum Highlight, über das man noch lange spricht.
          </p>
          {/* USP Pills */}
          <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/80">Maßgeschneidert</span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/80">15+ Jahre Erfahrung</span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/80">Europaweit</span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/80">Fair & transparent</span>
          </div>
          {/* CTAs */}
          <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/mediamaterial" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-white/80 text-black hover:bg-gray-200">Mediamaterial</Button>
            </a>
            <a href="/shows&formate" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-white/80 text-black hover:bg-gray-200">Shows & Formate</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero27 };
