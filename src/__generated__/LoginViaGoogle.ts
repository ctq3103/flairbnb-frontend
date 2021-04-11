/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginViaGoogle
// ====================================================

export interface LoginViaGoogle_loginViaGoogle_user {
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

export interface LoginViaGoogle_loginViaGoogle {
  __typename: "LoginOutput";
  ok: boolean;
  user: LoginViaGoogle_loginViaGoogle_user;
  error: string | null;
  token: string | null;
}

export interface LoginViaGoogle {
  loginViaGoogle: LoginViaGoogle_loginViaGoogle;
}

export interface LoginViaGoogleVariables {
  code: string;
}
