import React from "react";

interface Props {
  image: string;
}

export const ListingImages = ({ image }: Props) => {
  return (
    <div
      className=" h-75vh  -mx-16 -mt-8 mb-16 bg-cover bg-center"
      style={{
        backgroundImage: `url(${image})`,
      }}
    ></div>
  );
};
