import React from "react";
import { Carousel } from "react-responsive-carousel";

interface Props {
  images: string[];
}

export const ListingImages = ({ images }: Props) => {
  return (
    <div className="mb-16">
      <Carousel
        className=" -mx-16 -mt-8"
        showStatus={false}
        autoPlay={true}
        showArrows={true}
        showIndicators={true}
        infiniteLoop
        useKeyboardArrows={true}
        transitionTime={3000}
        showThumbs={false}
      >
        {images.map((image, index) => (
          <img
            src={image}
            className="h-75vh w-full object-cover bg-center"
            key={index}
            alt={`listing-${index}`}
          />
        ))}
      </Carousel>
    </div>
  );
};
