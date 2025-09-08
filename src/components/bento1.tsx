"use client";

import { useEffect, useRef, useState } from "react";
import { useLazyVideo } from "@/hooks/useLazyVideo";
import { motion, useAnimation, useInView } from "framer-motion";
import { Sparkles, Drama, Flashlight, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTranslation } from "react-i18next";

const Bento1 = () => {
  const { t } = useTranslation();
  const [showBeams, setShowBeams] = useState(false);

  const [spotPos, setSpotPos] = useState<{ x: string; y: string }>({ x: "50%", y: "50%" });
  const [isHovering, setIsHovering] = useState(false);

  const handleSpotMove = (e: any) => {
    if (!isHovering) setIsHovering(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotPos({ x: `${x}%`, y: `${y}%` });
  };
  const resetSpot = () => {
    setSpotPos({ x: "50%", y: "50%" });
    setIsHovering(false);
  };

  const handleSpotTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsHovering(true);
    const touch = e.touches[0];
    if (!touch) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setSpotPos({ x: `${x}%`, y: `${y}%` });
  };

  const cardRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(cardRef, { amount: 0.4, margin: "-10% 0px -10% 0px" });
  const controls = useAnimation();
  const isSmallScreen = typeof window !== "undefined"
    ? window.matchMedia && window.matchMedia("(max-width: 639px)").matches
    : false;

  useEffect(() => {
    if (inView) {
      const target = isSmallScreen
        ? { y: 0, opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 80, damping: 18, mass: 1.2, duration: 1.2 } }
        : { y: -70, opacity: 1, scale: 1.08, transition: { type: "spring" as const, stiffness: 80, damping: 18, mass: 1.2, duration: 1.6 } };
      controls.start(target).then(() => setShowBeams(true));
    }
  }, [inView, controls, isSmallScreen]);

  // Crossfade slider for middle card
  const sliderImages = [
    "/images/Bento1/Slider1.webp",
    "/images/Bento1/Slider2.webp",
    "/images/Bento1/Slider3.webp",
  ]


  const sliderImagesMobile =[
    "/images/Bento1/Slider1Mobile.webp",
    "/images/Bento1/Slider2Mobile.webp",
    "/images/Bento1/Slider3Mobile.webp",
  ]

  const [slide, setSlide] = useState(0);
  const [showSparkleAnim, setShowSparkleAnim] = useState(false);
  const [showGlobalSparkles, setShowGlobalSparkles] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [revealAll, setRevealAll] = useState(false);

  // Responsive slider images (mobile/desktop)
  const isMobile = typeof window !== "undefined"
    ? window.matchMedia && window.matchMedia("(max-width: 639px)").matches
    : false;
  const images = isMobile ? sliderImagesMobile : sliderImages;

  const videoSrc = isMobile ? "/videos/bentoVideoMobile.mp4" : "/videos/BentoVideo.mp4";
  const spotlightVideoRef = useLazyVideo();

  useEffect(() => {
    setSlide((s) => s % images.length);
    if (isPaused) return;
    const interval = isMobile ? 4500 : 3500;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, isPaused, isMobile]);

  return (
    <section className="sm:pt-16 sm:pb-8 md:py-16 cv-auto">
      <div className="container">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
          <Card className="group relative h-60 overflow-hidden rounded-xl border border-white/10 bg-black transition md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-full">
            <div ref={cardRef} />


            {/* Circus tent fly-in */}
            <motion.div
              initial={isSmallScreen ? { y: 40, opacity: 0, scale: 1 } : { y: -180, opacity: 0, scale: 0.9 }}
              animate={controls}
              transition={{ type: "spring", stiffness: 80, damping: 18, mass: 1.2, duration: 1.6 }}
              onAnimationComplete={() => setShowBeams(true)}
              className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end items-center"
              aria-hidden
            >
              <picture>
                <source
                  srcSet="/images/Bento1/CircusTentMobile.webp"
                  type="image/webp"
                  sizes="(max-width: 639px) 100vw, 1400px"
                  media="(max-width: 639px)"
                />
                <img
                  src="/images/Bento1/CircusTent.png"
                  alt="Circuszelt mit Luftartistin"
                  className="mt-auto h-auto w-full max-w-[1400px] max-h-full select-none object-contain object-center md:object-cover"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    console.error("/images/Bento1/CircusTent.png failed to load", e.currentTarget.src);
                  }}
                />
              </picture>
            </motion.div>

            {/* Spotlights: appear after fly-in */}
            {showBeams && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.6 }}
                  className="pointer-events-none absolute bottom-0 left-[8%] h-[140%] w-[45%] rotate-[-18deg] blur-sm z-20"
                  style={{
                    clipPath: "polygon(0% 0%, 22% 0%, 90% 100%, 0% 100%)",
                    background:
                      "linear-gradient(to bottom, rgba(255,255,220,0.0) 0%, rgba(255,255,200,0.25) 25%, rgba(255,253,170,0.35) 55%, rgba(255,253,170,0.0) 100%)",
                    mixBlendMode: "screen",
                  }}
                  aria-hidden
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="pointer-events-none absolute bottom-0 right-[8%] h-[140%] w-[45%] rotate-[18deg] blur-sm z-20"
                  style={{
                    clipPath: "polygon(78% 0%, 100% 0%, 100% 100%, 10% 100%)",
                    background:
                      "linear-gradient(to bottom, rgba(255,255,220,0.0) 0%, rgba(255,255,200,0.25) 25%, rgba(255,253,170,0.35) 55%, rgba(255,253,170,0.0) 100%)",
                    mixBlendMode: "screen",
                  }}
                  aria-hidden
                />
              </>
            )}

            {/* Subtle top gradient for readability */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
            {/* Discreet top-centered header with centered icon below */}
            <div className="absolute inset-x-0 top-3 z-30 flex items-start justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-2">
                <h2
                  className="text-center text-white font-semibold text-xl md:text-3xl lg:text-4xl tracking-tight px-3 leading-tight transition-opacity duration-300 group-hover:opacity-40"
                  style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}
                >
                  {t("bento1.hero.title")}
                </h2>
                <div
                  className="pointer-events-auto cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Show sparkles and spotlights"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}
                  onClick={() => {
                    setShowBeams(true);
                    setShowSparkleAnim(true);
                    setTimeout(() => {
                      setShowSparkleAnim(false);
                      setShowGlobalSparkles(true);
                      setTimeout(() => setShowGlobalSparkles(false), 10000);
                    }, 2500);
                  }}
                >
                  <motion.div
                    animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-[1px] sm:h-10 sm:w-10"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400 opacity-90 sm:h-5 sm:w-5" />
                  </motion.div>
                </div>
              </div>
            </div>

            <CardContent className="relative z-20 flex h-full flex-col justify-end p-6 pointer-events-none">
              {/* Visually hidden title for a11y (overlay above shows the visual title) */}
              <h2 className="sr-only">{t("bento1.hero.title")}</h2>
              {showSparkleAnim && (
                <div className="absolute top-4 right-2 sm:right-3 md:right-4 z-30 pointer-events-none">
                  <DotLottieReact
                    src="https://lottie.host/8f8332c8-41ef-4d9d-ad07-d9dd352b1cb4/UVLLlb0OP5.lottie"
                    loop
                    autoplay
                    style={{
                      width: "clamp(56px, 12vw, 128px)",
                      height: "clamp(56px, 12vw, 128px)",
                      filter: "brightness(1.8)",
                    }}
                  />
                </div>
              )}
              {showGlobalSparkles && (
                <div className="absolute inset-0 z-40 pointer-events-none">
                  <DotLottieReact
                    src="https://lottie.host/e86a7557-375e-4cf6-abc0-c8f0d034b637/mQay5cJDVU.lottie"
                    loop
                    autoplay
                    style={{ width: "100%", height: "100%", filter: "brightness(2)" }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            className="group relative h-60 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/80 backdrop-blur-sm transition hover:bg-neutral-900/60 md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-[600px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="absolute inset-0">
              {images.map((src, i) => (
                <motion.img
                  key={src}
                  src={src}
                  alt={t("bento1.slider.alt")}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === slide ? 0.9 : 0 }}
                  transition={{ duration: 0.8 }}
                />
              ))}
              <div className="absolute inset-0 bg-black/30" />
            </div>
            {/* Subtle top gradient for readability */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
            {/* Discreet top-centered title */}
            <div className="absolute inset-x-0 top-3 z-20 flex items-start justify-center pointer-events-none">
              <h2
                className="text-center text-white font-semibold text-xl md:text-3xl lg:text-4xl tracking-tight px-3 leading-tight transition-opacity duration-300 group-hover:opacity-40"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}
              >
                {t("bento1.middle.title")}
              </h2>
            </div>
            <CardContent className="z-10 flex h-full flex-col justify-end p-6">
              <h2 className="sr-only">{t("bento1.middle.title")}</h2>
            </CardContent>
          </Card>

          <Card
            className="group relative h-60 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/80 backdrop-blur-sm transition hover:bg-neutral-900/60 md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseMove={handleSpotMove}
            onMouseLeave={resetSpot}
            onTouchStart={() => setIsHovering(true)}
            onTouchMove={handleSpotTouch}
            onTouchEnd={resetSpot}
          >
            <div className="absolute inset-0">
              <video
                ref={spotlightVideoRef}
                autoPlay={!isMobile}
                controls={isMobile ? true : false}
                loop
                muted
                playsInline
                {...({ 'webkit-playsinline': 'true' } as any)}
                preload="none"
                data-src={videoSrc}
                poster="/images/Bento1/Slider3Mobile.webp"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: revealAll ? 'brightness(1)' : undefined }}
                onPointerDown={(e) => { const v = e.currentTarget; if (v.paused) { try { v.muted = true; v.play().catch(() => {}); } catch {} } }}
                onTouchStart={(e) => { const v = e.currentTarget; if (v.paused) { try { v.muted = true; v.play().catch(() => {}); } catch {} } }}
              />
              {!revealAll && (
                <>
                  {/* Global dark layer with a circular hole (mask) at the spotlight */}
                  <div
                    className={`absolute inset-0 ${isHovering ? "bg-black/90" : "bg-black/95"}`}
                    style={{
                      WebkitMaskImage: `radial-gradient(${isHovering ? "360px" : "120px"} at ${spotPos.x} ${spotPos.y}, rgba(0,0,0,0) ${isHovering ? "58%" : "40%"}, rgba(0,0,0,1) ${isHovering ? "62%" : "44%"})`,
                      maskImage: `radial-gradient(${isHovering ? "360px" : "120px"} at ${spotPos.x} ${spotPos.y}, rgba(0,0,0,0) ${isHovering ? "58%" : "40%"}, rgba(0,0,0,1) ${isHovering ? "62%" : "44%"})`,
                      transition: "mask-image 80ms linear, -webkit-mask-image 80ms linear, background-color 120ms linear",
                    }}
                    aria-hidden
                  />
                  {/* Subtle glow ring to make the light feel brighter */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: isHovering
                        ? `radial-gradient(460px at ${spotPos.x} ${spotPos.y}, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0) 72%)`
                        : `radial-gradient(180px at ${spotPos.x} ${spotPos.y}, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 28%, rgba(255,255,255,0) 60%)`,
                      mixBlendMode: "screen",
                      transition: "background 80ms linear",
                    }}
                    aria-hidden
                  />
                </>
              )}
            </div>
            {/* Subtle top gradient for readability */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
            {/* Discreet top-centered header with centered icon below */}
            <div className="absolute inset-x-0 top-3 z-20 flex items-start justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-2">
                <h2
                  className="text-center text-white font-semibold text-xl md:text-3xl lg:text-4xl tracking-tight px-3 leading-tight transition-opacity duration-300 group-hover:opacity-40"
                  style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}
                >
                  {t("bento1.third.title")}
                </h2>
                <div
                  className="pointer-events-auto cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Toggle spotlight reveal"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}
                  onClick={() => setRevealAll((v) => !v)}
                >
                  <motion.div
                    animate={typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches ? { opacity: [0.75, 1, 0.75], scale: [1, 1.02, 1] } : undefined}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-[1px] sm:h-10 sm:w-10"
                  >
                    <Flashlight className="h-4 w-4 text-yellow-400 opacity-90 sm:h-5 sm:w-5" />
                  </motion.div>
                </div>
              </div>
            </div>
            <CardContent className="relative z-10 flex h-full flex-col justify-end p-6">
              <h2 className="sr-only">{t("bento1.third.title")}</h2>
            </CardContent>
          </Card>

         

          <Card className="relative col-span-1 h-60 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/80 
          backdrop-blur-sm transition hover:bg-neutral-900/60 md:col-span-2 md:row-span-1 md:h-[300px] lg:col-span-4 lg:h-[300px]">
            <div className="flex h-full flex-col items-center justify-center p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-24 w-24">
                  <DotLottieReact
                    src="https://lottie.host/b2962fce-3098-47a6-872c-94da6b12033f/vP0MmCNB7f.lottie"
                    loop
                    autoplay
                  />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{t("bento1.responsibility.title")}</h3>
                <p className="text-sm text-gray-300 ">
                  {t("bento1.responsibility.body1")}<br/>
                  {t("bento1.responsibility.body2")}
                </p>
              </div>
            </div>
          </Card>


          <Card className="relative col-span-1 h-60 rounded-xl border border-white/10 bg-neutral-900/80 backdrop-blur-sm transition hover:bg-neutral-900/60 
          md:col-span-2 md:row-span-1 md:h-[300px] lg:col-span-4 lg:h-[300px]">
            <CardContent className="flex h-full flex-col items-center justify-center p-6">
              <span className="text-2xl font-bold text-white md:text-xl lg:text-3xl">{t("bento1.values.fairnessTitle")}</span>
              <p className="text-gray-300 my-6 text-center text-sm md:text-sm">
                {t("bento1.values.fairnessBodyPrefix")}{" "}
                <a
                  href="https://www.kreativkultur.berlin/en/resource-center/honoraruntergrenzen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                >
                  {t("bento1.values.linkText")}
                </a>
                .
              </p>
              <div className="flex -space-x-2">
                {["Artist1.webp","Artist2.webp","Artist3.webp","Artist4.webp","Artist5.webp"].map((file, i) => (
                  <Avatar
                    key={i}
                    className="border-border h-8 w-8 border-2 md:h-8 md:w-8 lg:h-10 lg:w-10"
                  >
                    <AvatarImage src={`/images/Slider/${file}`} />
                    <AvatarFallback>ART{i+1}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="relative col-span-1 h-60 rounded-xl border border-white/10 bg-neutral-900/80 backdrop-blur-sm transition 
          hover:bg-neutral-900/60 md:col-span-2 md:row-span-1 md:h-[300px] lg:col-span-4 lg:h-[300px]">
            <CardContent className="flex h-full flex-col items-center justify-center text-center p-6">
              <p className="text-gray-300 mb-6 text-center text-sm md:text-sm">
                {t("bento1.cta.body")}
              </p>
              <div className="mt-6 flex flex-col gap-4">
                <a href="/anfragen">
                  <Button
                    className="group flex w-full min-w-[220px] items-center justify-center gap-2 rounded-full tracking-tight bg-white text-black hover:bg-gray-200 font-[futura] px-6 py-2"
                  >
                    {t("bento1.cta.btnEnquire")}
                    <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:rotate-0" />
                  </Button>
                </a>
                <a href="/kontakt">
                  <Button
                    className="group flex w-full min-w-[220px] items-center justify-center gap-2 rounded-full tracking-tight bg-white text-black hover:bg-gray-200 font-[futura] px-6 py-2"
                  >
                    {t("bento1.cta.btnConsult")}
                    <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:rotate-0" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export { Bento1 };
