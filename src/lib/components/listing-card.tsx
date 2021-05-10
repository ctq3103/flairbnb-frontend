import React from "react";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

interface Props {
  listing: {
    id: number;
    title: string;
    images: string[];
    address: string;
    admin: string;
    country: string;
    price: number;
    numOfGuests: number;
  };
  checkIn?: string;
  checkOut?: string;
}

export const ListingCard = ({ listing, checkIn, checkOut }: Props) => {
  const { id, title, images, admin, country, price, numOfGuests } = listing;

  return (
    <div className="transform hover:scale-105 duration-300 ease-in-out shadow-md hover:shadow-lg rounded-lg bg-white">
      <div className="mb-2">
        <Carousel
          showStatus={false}
          autoPlay={false}
          showIndicators={true}
          infiniteLoop
          showThumbs={false}
          showArrows={true}
        >
          {images.map((image, index) => (
            <img
              src={image}
              className="h-56 w-full object-cover bg-center rounded"
              key={index}
              alt={`listing-${index}`}
            />
          ))}
        </Carousel>
      </div>
      <Link to={`/listing/${id}`}>
        <div className="px-4 pb-4 pt-2">
          <div className=" grid grid-cols-2 truncate">
            <span className="text-xs text-gray-600">
              {admin}, {country}
            </span>
          </div>

          <p className="w-full text-gray-900 text-lg truncate mb-4">{title}</p>

          <div className=" grid grid-cols-2 truncate items-end">
            <p className="text-black  w-full truncate">
              <span className="font-medium text-xl">{formatPrice(price)}</span>{" "}
              / night
            </p>
            <span className="text-sm flex items-center justify-self-end">
              <i className="fas fa-users text-xs mr-1 text-rose-500"></i>
              {numOfGuests} guests
            </span>
          </div>
          {checkIn && checkOut && (
            <div className="space-y-2 mt-4">
              <span className="text-xs font-semibold inline-block py-1 px-2  rounded-full text-indigo-600 bg-indigo-200 uppercase last:mr-0 mr-1">
                Check In: {checkIn}
              </span>
              <span className="text-xs font-semibold inline-block py-1 px-2  rounded-full text-indigo-600 bg-indigo-200 uppercase last:mr-0 mr-1">
                Check Out: {checkOut}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
