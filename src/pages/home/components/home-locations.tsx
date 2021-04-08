import React from "react";
import { Link } from "react-router-dom";
import torontoImage from "../../../images/toronto.jpg";
import parisImage from "../../../images/paris.jpg";
import londonImage from "../../../images/london.jpg";
import hanoiImage from "../../../images/hanoi.jpg";
import dubaiImage from "../../../images/dubai.jpg";
import losangelesImage from "../../../images/los-angeles.jpg";

const LOCATIONS = [
  { name: "toronto", image: torontoImage },
  { name: "paris", image: parisImage },
  { name: "london", image: londonImage },
  { name: "hanoi", image: hanoiImage },
  { name: "dubai", image: dubaiImage },
  { name: "los angeles", image: losangelesImage },
];

export const HomeLocations = () => {
  return (
    <>
      <p className="text-xl font-medium mb-4">Travel the world with Flairbnb</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-5 mb-20 w-full ">
        {LOCATIONS.map((location, index) => (
          <Link to={`/listings/${location.name}`} key={`type-${index}`}>
            <div className="transform hover:scale-105 duration-300 ease-in-out shadow hover:shadow-md rounded-lg bg-white space-y-4 pb-4">
              <img
                src={location.image}
                className="h- w-full object-cover bg-center rounded"
                alt="paris"
              />
              <p className="font-medium px-4 capitalize">{location.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
