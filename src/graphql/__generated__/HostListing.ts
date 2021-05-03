/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HostListingInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: HostListing
// ====================================================

export interface HostListing_hostListing {
  __typename: "HostListingOutput";
  id: number | null;
  ok: boolean;
  error: string | null;
}

export interface HostListing {
  hostListing: HostListing_hostListing;
}

export interface HostListingVariables {
  input: HostListingInput;
}
