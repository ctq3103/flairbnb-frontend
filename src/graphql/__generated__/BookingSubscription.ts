/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListingType } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: BookingSubscription
// ====================================================

export interface BookingSubscription_BookingSubscription_tenant {
  __typename: "User";
  id: number;
  createdAt: any;
  name: string;
  email: string;
  avatar: string | null;
  emailVerified: boolean;
  hasWallet: boolean;
  income: number;
}

export interface BookingSubscription_BookingSubscription_listing {
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

export interface BookingSubscription_BookingSubscription {
  __typename: "Booking";
  id: number;
  createdAt: any;
  checkIn: string;
  checkOut: string;
  tenant: BookingSubscription_BookingSubscription_tenant;
  listing: BookingSubscription_BookingSubscription_listing;
}

export interface BookingSubscription {
  BookingSubscription: BookingSubscription_BookingSubscription;
}
