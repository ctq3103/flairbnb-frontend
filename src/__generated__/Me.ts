/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Me
// ====================================================

export interface Me_me {
  __typename: "User";
  id: number;
  name: string;
  email: string;
  hasWallet: boolean;
  role: string;
  emailVerified: boolean;
}

export interface Me {
  me: Me_me;
}
