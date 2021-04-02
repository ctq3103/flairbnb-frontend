import React from "react";
import { Helmet } from "react-helmet-async";
import { HomeHero } from "../../components/home/home-hero";
import { HomeListings } from "../../components/home/home-listings";

export const Home = () => {
  return (
    <div className="container mx-auto">
      <Helmet>
        <title>Home | Flairbnb</title>
      </Helmet>
      <HomeHero />
      <HomeListings />
    </div>
  );
};
