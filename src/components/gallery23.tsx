"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logos3 } from "@/components/logos3";
import { useTranslation } from "react-i18next";

const Gallery23 = () => {
  const { t } = useTranslation();

  const images = [
    { id: 1, code: "#0031", title: t("gallery23.images.1"), image: "/images/eventTypes/Firmenfeier.webp" },
    { id: 2, code: "#0045", title: t("gallery23.images.2"), image: "/images/eventTypes/Incentive.webp" },
    { id: 3, code: "#0023", title: t("gallery23.images.3"), image: "/images/disciplines/Moderation.webp" },
    { id: 4, code: "#0007", title: t("gallery23.images.4"), image: "/images/disciplines/Luftakrobatik.webp" },
    { id: 5, code: "#0003", title: t("gallery23.images.5"), image: "/images/teamSizes/Solo.webp" },
  ];

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
    <section className="bg-black text-white mb-10 mx-5 cv-auto">
      <div className="container p-6 md:p-8 lg:p-10">
        <div className="relative flex flex-col items-center gap-10 md:gap-12 bg-black p-10 py-20 md:flex-row md:items-start">
          <div className="flex h-142 flex-col justify-center items-center text-center w-full md:flex-1 md:min-w-0 md:pr-10">
            <h1 className="max-w-lg font-calSans text-white">
              <span className="block text-3xl lg:hidden">{t("gallery23.headingMobile")}</span>
              <span className="hidden lg:block text-4xl">{t("gallery23.headingDesktop")}</span>
            </h1>
            <p className="text-md mt-10 max-w-2xl text-gray-300">
              {t("gallery23.subtitle")}
            </p>
            <Link to="/kontakt">
              <Button
                variant="secondary"
                className="group mt-10 flex w-fit items-center justify-center gap-2 rounded-full tracking-tight bg-white text-black hover:bg-gray-200"
              >
                {t("gallery23.cta")}
                <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:rotate-0" />
              </Button>
            </Link>
            <div className="lg:mt-8 w-full md:max-w-[36rem] md:self-center overflow-hidden">
              <Logos3 />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 w-full md:flex-1 md:min-w-0">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ height: "2.5rem" }}
                animate={{
                  height: activeImage === index ? "auto" : "2.5rem",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={() => setActiveImage(index)}
                onHoverStart={() => setActiveImage(index)}
                className="group relative cursor-pointer overflow-hidden rounded-4xl border w-full max-w-full self-stretch aspect-square"
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
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
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
