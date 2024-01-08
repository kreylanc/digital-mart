import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type ImageSliderProps = {
  images: {
    url: string;
    alt?: string;
  }[];
};

const ImageSlider = ({ images }: ImageSliderProps) => {
  // Intializing Use states
  const [api, setApi] = useState<CarouselApi>(); // To be able to use the API options from Embla carousel
  const [current, setCurrent] = useState(0); // Track the current item of the carousel in view
  const [count, setCount] = useState(0); // Number of items in the carousel

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    // Event runs when an item is scrolled
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const activeStyle =
    "active:scale-[0.97] grid absolute top-1/2 -translate-y-1/2 opacity-100 hover:scale105";
  const inactiveStyle = "hidden text-slate-400";
  return (
    <Carousel className="group" setApi={setApi}>
      <CarouselContent>
        {images.map((image, i) => (
          <CarouselItem key={i} className="aspect-square">
            <div className="relative w-full h-full">
              <Image
                src={image.url}
                alt={image.alt ?? "product image"}
                fill
                loading="eager"
                className="-z-10 object-cover w-full h-full object-center"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute left-0 top-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <CarouselPrevious className="left-2" />
      </div>
      <div className="absolute opacity-0 right-0 top-1/2 transition-opacity group-hover:opacity-100">
        <CarouselNext className="right-2" />
      </div>
      <div className="absolute bottom-4 w-full flex items-center justify-center gap-x-1 pointer-events-none">
        {Array.from({ length: count }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "inset-0 h-2 w-2 rounded-full  bg-primary/65 transition scale-90",
              {
                "scale-100 bg-white": current === index,
              }
            )}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default ImageSlider;
