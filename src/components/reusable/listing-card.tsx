import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

interface Props {
  listing: {
    id: number;
    title: string;
    image: string;
    address: string;
    admin: string;
    country: string;
    price: number;
    numOfGuests: number;
  };
}

export const ListingCard = ({ listing }: Props) => {
  const {
    id,
    title,
    image,
    address,
    admin,
    country,
    price,
    numOfGuests,
  } = listing;

  return (
    <Link
      to={`/listing/${id}`}
      className="transform hover:scale-105 duration-300 ease-in-out shadow-md hover:shadow-lg rounded-lg bg-white"
    >
      <div
        className="w-full h-56 bg-cover bg-center rounded-lg mb-2"
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>
      <div className="px-4 pb-4 pt-2">
        <div className=" grid grid-cols-2 truncate">
          {/* <span className="uppercase font-medium text-xs border border-black text-black rounded py-px px-2 mr-2">
            Superhost
          </span> */}
          <span className="text-xs text-gray-600">
            {admin}, {country}
          </span>
        </div>

        <p className="w-full text-gray-900 text-lg truncate mb-4">{title}</p>

        <div className=" grid grid-cols-2 truncate items-end">
          <p className="text-black  w-full truncate">
            <span className="font-medium text-xl">{formatPrice(price)}</span> /
            night
          </p>
          <span className="text-sm flex items-center justify-self-end">
            {/* <i className="fas fa-star text-xs mr-1 text-rose-500"></i> */}
            <i className="fas fa-users text-xs mr-1 text-rose-500"></i>
            {numOfGuests} guests
          </span>
        </div>

        {/* <div className="space-y-2 ">
          <span className="text-xs font-semibold inline-block py-1 px-2  rounded-full text-indigo-600 bg-indigo-200 uppercase last:mr-0 mr-1">
            Check In: 03/28/2021
          </span>
          <span className="text-xs font-semibold inline-block py-1 px-2  rounded-full text-indigo-600 bg-indigo-200 uppercase last:mr-0 mr-1">
            Check Out: 04/06/2021
          </span>
        </div> */}
      </div>
    </Link>
  );
};
