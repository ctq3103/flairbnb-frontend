import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ListingCard } from "../listing-card";

describe("<ListingCard />", () => {
  const listing = {
    id: 1,
    title: "Test title",
    images: [
      "https://images.unsplash.com/photo-1575220360526-be964710f279?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    ],
    address: "Test address",
    admin: "Test admin",
    country: "Test country",
    price: 12000,
    numOfGuests: 4,
  };

  it("should render OK with props", () => {
    const { getByText } = render(
      <Router>
        <ListingCard
          listing={listing}
          checkIn="2021-12-12"
          checkOut="2021-12-21"
        />
      </Router>,
    );
    getByText("Test title");
  });
});
