/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ListingType {
  ENTIRE_PLACE = "ENTIRE_PLACE",
  HOTEL_ROOM = "HOTEL_ROOM",
  PRIVATE_ROOM = "PRIVATE_ROOM",
  SHARED_ROOM = "SHARED_ROOM",
}

export enum ListingsFilter {
  PRICE_HIGH_TO_LOW = "PRICE_HIGH_TO_LOW",
  PRICE_LOW_TO_HIGH = "PRICE_LOW_TO_HIGH",
}

export interface CreateAccountInput {
  name: string;
  email: string;
  password: string;
}

export interface EditProfileInput {
  name?: string | null;
  email?: string | null;
  password?: string | null;
}

export interface LoginViaEmailInput {
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
