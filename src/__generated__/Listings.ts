/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListingsFilter } from "./globalTypes";

// ====================================================
// GraphQL query operation: Listings
// ====================================================

export interface Listings_listings_result {
  __typename: "Listing";
  id: number;
  title: string;
  images: string[];
  address: string;
  admin: string;
  country: string;
  price: number;
  numOfGuests: number;
}

export interface Listings_listings {
  __typename: "ListingsOutput";
  ok: boolean;
  error: string | null;
  region: string | null;
  totalPages: number;
  totalResults: number;
  result: Listings_listings_result[];
}

export interface Listings {
  listings: Listings_listings;
}

export interface ListingsVariables {
  location?: string | null;
  filter: ListingsFilter;
  limit: number;
  page: number;
}
