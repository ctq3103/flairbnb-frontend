/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListingType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Listing
// ====================================================

export interface Listing_listing_listing_bookings_result_tenant {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
}

export interface Listing_listing_listing_bookings_result {
  __typename: "Booking";
  tenant: Listing_listing_listing_bookings_result_tenant;
  checkIn: string;
  checkOut: string;
}

export interface Listing_listing_listing_bookings {
  __typename: "ListingBookingsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number;
  totalResults: number;
  result: Listing_listing_listing_bookings_result[];
}

export interface Listing_listing_listing_host {
  __typename: "User";
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  emailVerified: boolean;
  hasWallet: boolean;
}

export interface Listing_listing_listing {
  __typename: "Listing";
  title: string;
  description: string;
  image: string;
  type: ListingType;
  address: string;
  country: string;
  admin: string;
  city: string;
  price: number;
  numOfGuests: number;
  bookingsIndex: string;
  bookings: Listing_listing_listing_bookings;
  host: Listing_listing_listing_host;
}

export interface Listing_listing {
  __typename: "ListingOutput";
  ok: boolean;
  error: string | null;
  listing: Listing_listing_listing;
}

export interface Listing {
  listing: Listing_listing;
}

export interface ListingVariables {
  id: number;
  limit: number;
  page: number;
}
