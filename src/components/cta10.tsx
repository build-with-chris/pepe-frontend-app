import React from "react";
import { Button } from "@/components/ui/button";

interface Cta10Props {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  rightAddon?: React.ReactNode; // optional Zusatz-Element rechts neben dem Primary-Button (z. B. Lottie)
}
const Cta10 = ({
  heading,
  description,
  buttons,
  rightAddon,
}: Cta10Props) => {
  return (
    <section className="md:py-16 bg-black text-white ">
      <div className="w-full ">
        <div className="bg-white/5 lg:flex-row backdrop-blur-sm rounded-lg p-8 flex w-full flex-col gap-16 overflow-hidden rounded-lg p-8 md:rounded-xl lg:items-center lg:p-12 ">
          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold text-white md:mb-4 md:text-4xl lg:mb-6">
              {heading}
            </h3>
            <p className="w-full text-white/70 lg:text-xl whitespace-pre-line">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-col sm:flex-row">
            {buttons?.primary && (
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
                <a href={buttons.primary.url}>{buttons.primary.text}</a>
              </Button>
            )}

            {rightAddon && (
              <span className="ml-5 inline-flex items-center select-none pointer-events-none">
                {rightAddon}
              </span>
            )}

            {buttons?.secondary && (
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta10 };
