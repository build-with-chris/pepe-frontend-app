"use client";

import { motion } from "framer-motion";
import { AudioLines, Globe, TrophyIcon } from "lucide-react";
import React, { useState } from "react";

type Chip = {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
};

type FeatureItem = {
  id: number;
  img: string;
  link: string;
  title: string;
  description: string;
  chips: Chip[];
};

const featureData: FeatureItem[] = [
  {
    id: 1,
    img: "/images/Galerie34/Solo.webp",
    link: "#",
    title: "Solo-Act",
    description: "5–8 Min | 1 Artist",
    chips: [],
  },
  {
    id: 2,
    img: "/images/Galerie34/Duo.webp",
    link: "#",
    title: "Duo-Act",
    description: "15–20 Min | 2 Artists",
    chips: [],
  },
  {
    id: 3,
    img: "/images/Galerie34/Konzeptshow.webp",
    link: "#",
    title: "Konzeptshow",
    description: "20–50 Min | Ensemble",
    chips: [],
  },
  {
    id: 4,
    img: "/images/Galerie34/Variete.webp",
    link: "#",
    title: "Varieté Show",
    description: "1–2 Std | Ensemble",
    chips: [],
  },
  {
    id: 5,
    img: "/images/Galerie34/Zauberer.webp",
    link: "#",
    title: "Zauberer",
    description: "30 Min | 1 Artist",
    chips: [],
  },
  {
    id: 6,
    img: "/images/Galerie34/Feuershow.webp",
    link: "#",
    title: "Feuershow",
    description: "30 Min | Outdoor",
    chips: [],
  },
];

const Gallery34 = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getDetails = (item: FeatureItem): string[] => {
    switch (item.id) {
      case 1:
        return [
          "Starkes Highlight für Galas & Preisverleihungen",
          "Schneller Aufbau, geringe Bühne nötig",
          "Direkt buchbar über Booking Assistent",
        ];
      case 2:
        return [
          "Zusammenspiel verschiedener Disziplinen (Mann & Frau)",
          "Perfekt für längere Acts bei Galas & Veranstaltungen",
          "Indoor flexibel",
          "Direkt buchbar über Booking Assistent",
        ];
      case 3:
        return [
          "Entertainment zum Sitzen und Staunen",
          "Über Monate gereifte und verfeinerte Idee",
          "Indoor flexibel",
          "Nur auf Anfrage",
        ];
      case 4:
        return [
          "Flexibel anpassbar an die Veranstaltung",
          "Abendfüllend & vielfältig",
          "Indoor flexibel",
          "Nur auf Anfrage",
        ];
      case 5:
        return [
          "Walking Act oder Bühnenshow",
          "Allrounder",
          "Indoor flexibel",
          "Direkt buchbar über Booking Assistent",
        ];
      case 6:
        return [
          "Episch – verschiedene Feuerelemente",
          "Verknüpfung mit Akrobatik",
          "Outdoor empfohlen",
          "Direkt buchbar über Booking Assistent",
        ];
      default:
        return [];
    }
  };

  return (
    <section className="h-full overflow-hidden bg-black md:py-16 text-white">
      <div className="container">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureData.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
              role="button"
              tabIndex={0}
              className="group relative overflow-hidden rounded-3xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <motion.img
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                  delay: index * 0.1 + 0.5,
                }}
                animate={{
                  filter:
                    hoveredIndex !== null && hoveredIndex !== index
                      ? "blur(10px)"
                      : "blur(0px)",
                  transition: {
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0,
                  },
                  scale: hoveredIndex === index ? 1.02 : 1,
                }}
                src={item.img}
                className="pointer-events-none h-72 w-full rounded-2xl object-cover"
                alt={item.title}
              />
              <div
                className="pointer-events-none absolute right-4 top-4 z-20 rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium text-gray-200 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                Klick für Details
              </div>
              {openIndex === index && (
                <div
                  className="mt-3 rounded-2xl border border-white/10 bg-black/90 p-4 text-white shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <button
                      aria-label="Popover schließen"
                      className="rounded-md p-1 text-gray-400 hover:text-white hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenIndex(null);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <ul className="list-disc space-y-2 pl-4 text-sm text-gray-200">
                    {getDetails(item).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2 p-2">
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="mt-2 whitespace-pre-line text-sm text-gray-400">
                    {item.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  {item.chips.map((chip, index) => {
                    const IconComponent = chip.icon;
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200"
                      >
                        <IconComponent className="size-4" /> {chip.value}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery34 };