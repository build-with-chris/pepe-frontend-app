import { CircleArrowRight, Files, Settings } from "lucide-react";
import AboutImage1 from "/images/About1/About1.1.webp";
import AboutImage2 from "/images/About1/About1.2.webp";
import { useTranslation } from "react-i18next";

const About1 = () => {
  const { t } = useTranslation();
  return (
    <section className="py-32 bg-black text-white">
      <div className="container flex flex-col gap-28 px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col gap-7">
          <h1 className="text-4xl font-semibold lg:text-5xl [text-wrap:balance]">
            {t("about1.hero.title")}
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            {t("about1.hero.subtitle")}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
      
          <img
            src={AboutImage1}
            alt="PepeShows Performance"
            className="size-full max-h-96 rounded-2xl object-cover"
          />
          <div className="flex flex-col justify-between gap-10 rounded-2xl bg-white/5 backdrop-blur-sm p-10">
            <p className="text-sm text-white/60 tracking-wide">{t("about1.mission.kicker")}</p>
            <p className="text-lg font-medium text-white/90">
              {t("about1.mission.body")}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:gap-20">
          </div>
          <h2 className="text-3xl font-semibold text-white">
            {t("about1.sectionTitle")}
          </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">{t("about1.cards.solo.title")}</h3>
            <p className="text-white/70 mb-3">{t("about1.cards.solo.meta")}</p>
            <ul className="text-white/70 space-y-1 list-disc list-inside">
              <li>{t("about1.cards.solo.b1")}</li>
              <li>{t("about1.cards.solo.b2")}</li>
              <li>{t("about1.cards.solo.b3")}</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">{t("about1.cards.block.title")}</h3>
            <p className="text-white/70 mb-3">{t("about1.cards.block.meta")}</p>
            <ul className="text-white/70 space-y-1 list-disc list-inside">
              <li>{t("about1.cards.block.b1")}</li>
              <li>{t("about1.cards.block.b2")}</li>
              <li>{t("about1.cards.block.b3")}</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">{t("about1.cards.variete.title")}</h3>
            <p className="text-white/70 mb-3">{t("about1.cards.variete.meta")}</p>
            <ul className="text-white/70 space-y-1 list-disc list-inside">
              <li>{t("about1.cards.variete.b1")}</li>
              <li>{t("about1.cards.variete.b2")}</li>
              <li>{t("about1.cards.variete.b3")}</li>
            </ul>
          </div>
        </div>

        

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white/5 p-4 text-white/80">
            <span className="block text-sm">{t("about1.info.lead.kicker")}</span>
            <span className="text-lg font-semibold">{t("about1.info.lead.value")}</span>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-white/80">
            <span className="block text-sm">{t("about1.info.stage.kicker")}</span>
            <span className="text-lg font-semibold">{t("about1.info.stage.value")}</span>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-white/80">
            <span className="block text-sm">{t("about1.info.tech.kicker")}</span>
            <span className="text-lg font-semibold">{t("about1.info.tech.value")}</span>
          </div>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-10 text-sm font-medium text-white/60 tracking-wide">
              {t("about1.next.kicker")}
            </p>
            <h2 className="mb-2.5 text-3xl font-semibold">
              {t("about1.next.title")}
            </h2>
            <div className="flex justify-center md:mt-10 md:-ml-20">
              <video
                src="/videos/Short Trailer.webm"
                muted
                autoPlay
                loop
                playsInline
                className="w-full max-w-2xl h-auto object-cover rounded-2xl"
              />
            </div>
          </div>
          <div className="md:mt-35">
     
            <p className="text-white/70 mb-4">
              {t("about1.next.body")}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/anfragen" className="inline-flex items-center px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200">{t("about1.next.cta.assistant")}</a>
              <a href="/kontakt" className="inline-flex items-center px-4 py-2 rounded-md border border-white/30 text-white hover:bg-white/10">{t("about1.next.cta.consult")}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { About1 };
