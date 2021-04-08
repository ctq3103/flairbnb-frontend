/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListingType } from "./globalTypes";

// ====================================================
// GraphQL fragment: ListingParts
// ====================================================

export interface ListingParts {
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
