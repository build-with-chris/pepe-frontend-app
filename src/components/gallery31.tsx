import React from "react";

import { DirectionAwareHover } from "@/components/aceternity/direction-aware-hover";

const featureData = [
  {
    imgClass: "md:h-70 !w-full rounded-3xl",
    imgsrc: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img7.jpeg",
    ptitle: "Gaming Controller",
    pdes: "$199",
  },
  {
    imgClass: "md:h-70 !w-full rounded-3xl lg:col-span-2",
    imgsrc: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img6.jpeg",
    ptitle: "Wireless Headphones",
    pdes: "$189",
  },
  {
    imgClass: "md:h-70 col-span-1 !h-full !w-full rounded-3xl lg:row-span-2",
    imgsrc: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img11.jpeg",
    ptitle: "Smart Watch",
    pdes: "$249",
  },
  {
    imgClass: "md:h-70 !w-full rounded-3xl lg:col-span-2",
    imgsrc: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img14.jpeg",
    ptitle: "Bluetooth Speaker",
    pdes: "$179",
  },
  {
    imgClass: "md:h-70 !w-full rounded-3xl",
    imgsrc: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img13.jpeg",
    ptitle: "Mechanical Keyboard",
    pdes: "$219",
  },
];

const Gallery31 = () => {
  return (
    <section className="relative h-full w-screen overflow-hidden py-32">
      <div className="container relative flex h-full w-full flex-col items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center gap-5">
          <p className="bg-muted rounded-full px-2 py-1 text-xs uppercase">
            CATALOG
          </p>
          <h1 className="font-calSans text-center text-6xl font-medium">
            Exclusive shadcnblocks
          </h1>
          <p className="text-muted-foreground text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          </p>
        </div>
        <div className="relative mt-[34px] grid w-full max-w-5xl grid-cols-1 justify-center gap-[10px] md:grid-cols-2 lg:grid-cols-4">
          {featureData.map((item, index) => (
            <DirectionAwareHover
              key={index}
              className={item.imgClass}
              imageUrl={item.imgsrc}
            >
              <p className="text-xl font-bold">{item.ptitle}</p>
              <p className="text-sm font-normal">{item.pdes}</p>
            </DirectionAwareHover>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery31 };
