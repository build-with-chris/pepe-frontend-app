"use client";
import { MessagesSquare, Play } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Hero135 = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Fragment>
      <section className="bg-black py-12 font-sans md:py-10 md:mb-12">
        <div className="container">
          <div className="flex flex-col justify-center gap-8 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col gap-10">
              <div className="bg-gray-800 flex w-fit items-center gap-2 rounded-md py-2 pl-4 pr-3">
                <MessagesSquare className="stroke-white h-7 w-7" />
                <div className="text-white text-lg font-bold">
                  {t("hero135.kicker")}
                </div>
              </div>
              <h1 className="text-white max-w-96 text-2xl font-medium lg:text-3xl">
                {t("hero135.heading")}
              </h1>
              <p className="text-gray-300 max-w-96 text-lg leading-normal lg:text-xl">
                {t("hero135.subtitle")}
              </p>
            </div>
            <div className="flex-1">
              <div className="relative w-full overflow-hidden rounded-3xl">
                <AspectRatio ratio={1}>
                  <div className="size-full">
                    <video
                      src="/videos/Vorschauloop.webm"
                      muted
                      autoPlay
                      loop
                      className="size-full object-cover object-center"
                    />
                    <Button
                      size="icon"
                      onClick={() => setIsVideoOpen(true)}
                      className="bg-background hover:bg-background absolute bottom-0 left-0 m-10 flex size-fit w-fit items-center gap-4 rounded-full py-3 pl-3 pr-8 transition-transform hover:scale-105"
                    >
                      <div className="bg-primary flex h-20 w-20 rounded-full">
                        <Play className="size-7! m-auto fill-white stroke-white" />
                      </div>
                      <div>
                        <div className="text-black text-left text-base font-semibold">
                          {t("hero135.play.title")}
                        </div>
                        <div className="text-gray-500 text-left text-base font-medium">
                          {t("hero135.play.brand")}
                        </div>
                      </div>
                    </Button>
                  </div>
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{t("hero135.dialog.title")}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/dXHLaIkezTM"
              title={t("hero135.dialog.title")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export { Hero135 };