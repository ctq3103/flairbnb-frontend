/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListingType } from "./globalTypes";

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_userProfile_user_bookings_result_listing {
  __typename: "Listing";
  id: number;
  title: string;
  description: string;
  images: string[];
  type: ListingType;
  address: string;
  country: string;
  admin: string;
  city: string;
  price: number;
  numOfGuests: number;
}

export interface User_userProfile_user_bookings_result {
  __typename: "Booking";
  id: number;
  listing: User_userProfile_user_bookings_result_listing;
  checkIn: string;
  checkOut: string;
}

export interface User_userProfile_user_bookings {
  __typename: "UserBookingsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number;
  totalResults: number;
  result: User_userProfile_user_bookings_result[];
}

export interface User_userProfile_user_listings_result {
  __typename: "Listing";
  id: number;
  title: string;
  description: string;
  images: string[];
  type: ListingType;
  address: string;
  country: string;
  admin: string;
  city: string;
  price: number;
  numOfGuests: number;
}

export interface User_userProfile_user_listings {
  __typename: "UserListingsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number;
  totalResults: number;
  result: User_userProfile_user_listings_result[];
}

export interface User_userProfile_user {
  __typename: "User";
  id: number;
  createdAt: any;
  name: string;
  email: string;
  avatar: string | null;
  emailVerified: boolean;
  hasWallet: boolean;
  income: number;
  bookings: User_userProfile_user_bookings;
  listings: User_userProfile_user_listings;
}

export interface User_userProfile {
  __typename: "UserProfileOutput";
  ok: boolean;
  error: string | null;
  user: User_userProfile_user;
}

export interface User {
  userProfile: User_userProfile;
}

export interface UserVariables {
  userId: number;
  bookingsPage: number;
  listingsPage: number;
  limit: number;
}
