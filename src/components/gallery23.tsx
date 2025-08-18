"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const images = [
  {
    id: 1,
    code: "#0031",
    title: "Gala-Abende",
    image: "/images/eventTypes/Firmenfeier.webp",
  },
  {
    id: 2,
    code: "#0045",
    title: "Jubiläen",
    image: "/images/eventTypes/Incentive.webp",
  },
  {
    id: 3,
    code: "#0023",
    title: "Firmenfeiern",
    image: "/images/disciplines/Moderation.webp",
  },
  {
    id: 4,
    code: "#0007",
    title: "Festivals",
    image: "/images/disciplines/Luftakrobatik.webp",
  },
  {
    id: 5,
    code: "#0003",
    title: "Weihnachtsfeiern",
    image: "/images/teamSizes/Solo.webp",
  },
]

const Gallery23 = () => {
  const [activeImage, setActiveImage] = useState<number | null>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % images.length;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-black text-white py-10">
      <div className="container overflow-hidden p-10">
        <div className="relative flex flex-col items-center justify-between gap-12 border border-white/20 bg-black p-10 py-20 md:flex-row">
          <DashedBorderV className="absolute -top-10 -left-px h-[150%] w-px" />
          <DashedBorderH className="absolute -top-px -left-10 h-px w-[150%]" />
          <DashedBorderV className="absolute -top-10 -right-px h-[150%] w-px" />
          <DashedBorderH className="absolute -bottom-px -left-12 h-px w-[150%]" />
          <div className="flex h-142 flex-col justify-center">
            <h1 className="max-w-lg font-calSans text-white">
              <span className="block text-3xl md:hidden">Exzellenz statt Mittelmaß</span>
              <span className="hidden md:block text-4xl">Wir glauben nicht an Mittelmaß – bei uns gibt es Exzellenz.</span>
            </h1>
            <p className="text-md mt-10 max-w-md text-gray-300">
              Wir erschaffen Momente, die im Kopf und im Herzen bleiben.
            </p>
            <Link to="/kontakt">
              <Button
                variant="secondary"
                className="group mt-10 flex w-fit items-center justify-center gap-2 rounded-full tracking-tight bg-white text-black hover:bg-gray-200"
              >
                Lass uns reden
                <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:rotate-0" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className="group relative cursor-pointer overflow-hidden rounded-4xl border"
                initial={{ height: "2.5rem", width: "24rem" }}
                animate={{
                  height: activeImage === index ? "24rem" : "2.5rem",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={() => setActiveImage(index)}
                onHoverStart={() => setActiveImage(index)}
              >
                <AnimatePresence>
                  {activeImage === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute h-full w-full bg-gradient-to-t from-black/70 to-transparent"
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {activeImage === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute flex h-full w-full flex-col items-end justify-end px-4 pb-5"
                    >
                    
                      <h3 className="text-3xl font-bold text-white">
                        {image.title.split(" ")[0]}
                        <span className="font-playfair italic">
                          {" "}
                          {image.title.split(" ")[1]}{" "}
                        </span>
                      </h3>
               
                    </motion.div>
                  )}
                </AnimatePresence>
                <img
                  src={image.image}
                  className="size-full object-cover"
                  alt={image.title}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const DashedBorderH = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} fill="none" xmlns="http://www.w3.org/2000/svg">
      <line
        opacity="0.2"
        x1="1571.5"
        y1="0.570312"
        x2="0.683594"
        y2="0.570271"
        stroke="white"
        strokeDasharray="5 5"
      />
    </svg>
  );
};
const DashedBorderV = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} fill="none" xmlns="http://www.w3.org/2000/svg">
      <line
        opacity="0.2"
        x1="0.631348"
        y1="0.208984"
        x2="0.631311"
        y2="828.348"
        stroke="white"
        strokeDasharray="5 5"
      />
    </svg>
  );
};

export { Gallery23 };
