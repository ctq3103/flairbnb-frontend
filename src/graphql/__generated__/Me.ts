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
  createdAt: any;
  name: string;
  email: string;
  avatar: string | null;
  emailVerified: boolean;
  hasWallet: boolean;
  income: number;
}

export interface Me {
  me: Me_me;
}
