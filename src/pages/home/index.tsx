import React from "react";
import { Helmet } from "react-helmet-async";
import { HomeListingTypes } from "./components/home-listing-types";
import { HomeLocations } from "./components/home-locations";

export const Home = () => {
  return (
    <div className="container mx-auto">
      <Helmet>
        <title>Home | Flairbnb</title>
      </Helmet>
      {/* <HomeHero /> */}
      <HomeLocations />
      {/* <HomeListings /> */}
      <HomeListingTypes />
    </div>
  );
};
