/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ConnectStripe
// ====================================================

export interface ConnectStripe_connectStripe {
  __typename: "ConnectStripeOutput";
  ok: boolean;
  error: string | null;
}

export interface ConnectStripe {
  connectStripe: ConnectStripe_connectStripe;
}

export interface ConnectStripeVariables {
  code: string;
}
