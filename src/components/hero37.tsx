import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import HeroLinks from "/images/Hero37/HeroLinks.webp";
import HeroMitte from "/images/Hero37/HeroMitte.webp";
import HeroRechts from "/images/Hero37/HeroRechts.webp";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";

const Hero37 = () => {
  const [showVideo, setShowVideo] = useState(true);
  const playCountRef = useRef(0);

  useEffect(() => {
    if (!showVideo) return;
    function createPlayer() {
      // @ts-ignore
      const YTGlobal = (window as any).YT;
      if (!YTGlobal || !YTGlobal.Player) return;
      // Create player in the placeholder div
      // @ts-ignore
      const player = new YTGlobal.Player("heroVideo", {
        width: "100%",
        height: "100%",
        videoId: "KpHKDa7XZe8",
        playerVars: {
          autoplay: 1,
          mute: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          controls: 0,
          loop: 0,
        },
        events: {
          onReady: (e: any) => {
            try { e.target.playVideo(); } catch {}
          },
          onStateChange: (e: any) => {
            // 0 = ended
            // @ts-ignore
            const ENDED = (window as any).YT?.PlayerState?.ENDED ?? 0;
            if (e.data === ENDED) {
              playCountRef.current += 1;
              if (playCountRef.current >= 1) {
                try { e.target.stopVideo(); e.target.destroy(); } catch {}
                setShowVideo(false);
              }
            }
          },
        },
      });
    }

    // If API not loaded, load it and attach callback
    if (!(window as any).YT || !(window as any).YT.Player) {
      (window as any).onYouTubeIframeAPIReady = () => createPlayer();
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      createPlayer();
    }
  }, [showVideo]);

  return (
    <section className="overflow-hidden bg-black text-white pt-20">
      <div className="container flex flex-col items-center text-center">
        <p className="text-xs uppercase tracking-wide text-white/60">Shows & Formate</p>
        <h1 className="my-3 text-2xl font-bold text-pretty sm:text-4xl md:my-6 lg:text-5xl">
          Komplette Varieté‑Shows, Solo‑Acts oder maßgeschneiderte Ensemble‑Konzepte.
        </h1>
        <p className="mb-6 max-w-xl text-gray-300 md:mb-12 lg:text-xl">
          Wir kuratieren und produzieren Bühnenprogramme – vom 15‑minütigen Highlight bis abendfüllend. Solo‑Künstler vermitteln wir direkt; für Gruppen entwickeln wir individuelle Konzepte inklusive Ablauf, Musik und Kostüm.
        </p>
        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
          <Link to="/anfragen" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <ArrowRight className="mr-2 size-4" />
              Show anfragen
            </Button>
          </Link>
          <Link to="/kontakt" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              Beratung buchen
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-16 flex flex-col items-center justify-center lg:mt-32">
        <div className="b relative mx-auto aspect-square w-[95%] max-w-[31.25rem] sm:w-full">
          <div className="absolute inset-x-1/2 top-full z-0 flex w-[120rem] -translate-x-1/2 -translate-y-[4rem] md:-translate-y-[2rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 800 800"
              className="h-full w-full text-white/20"
            >
              {Array.from(Array(4000).keys()).map((dot, index, array) => {
                const angle = 0.2 * index;
                const scalar = 300 + index * (100 / array.length);
                const x = Math.round(Math.cos(angle) * scalar);
                const y = Math.round(Math.sin(angle) * scalar);
                return (
                  <circle
                    key={index}
                    r={1}
                    cx={400 + x}
                    cy={400 + y}
                    fill="currentColor"
                    opacity={(array.length - index) / array.length}
                  />
                );
              })}
            </svg>
          </div>
          <img
            src={HeroLinks}
            alt="Hero Links"
            className="absolute inset-0 z-20 m-auto flex w-4/5 max-w-[16rem] translate-x-[-75%] translate-y-[10%] scale-[0.85] rotate-[-15deg] justify-center rounded-lg border border-white/20 bg-white/10 opacity-60 md:w-[22rem] md:max-w-[22rem] md:translate-x-[-90%] md:translate-y-[-10%] md:scale-100"
            style={{ aspectRatio: "29/36", objectFit: "cover" }}
          />
          {showVideo ? (
            <div
              className="hidden md:block absolute inset-0 z-10 m-auto w-full max-w-[28rem] rounded-lg border border-white/20 bg-white/10 overflow-hidden"
              style={{ aspectRatio: "16/9" }}
            >
              <div id="heroVideo" className="w-full h-full" />
            </div>
          ) : (
            <img
              src={HeroMitte}
              alt="Hero Mitte"
              className="hidden md:block absolute inset-0 z-10 m-auto w-full max-w-[28rem] rounded-lg border border-white/20 bg-white/10"
              style={{ aspectRatio: "29/36", objectFit: "cover" }}
            />
          )}
          <img
            src={HeroMitte}
            alt="Hero Mitte"
            className="block md:hidden absolute inset-0 z-10 m-auto flex w-4/5 max-w-[16rem] justify-center rounded-lg border border-white/20 bg-white/10 md:w-[21.25rem] md:max-w-[21.25rem]"
            style={{ aspectRatio: "29/36", objectFit: "cover" }}
          />
          <img
            src={HeroRechts}
            alt="Hero Rechts"
            className="absolute inset-0 z-20 m-auto flex w-4/5 max-w-[16rem] translate-x-[75%] translate-y-[10%] scale-[0.85] rotate-[15deg] justify-center rounded-lg border border-white/20 bg-white/10 opacity-60 md:w-[22rem] md:max-w-[22rem] md:translate-x-[90%] md:translate-y-[-10%] md:scale-100"
            style={{ aspectRatio: "29/36", objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  );
};

export { Hero37 };
