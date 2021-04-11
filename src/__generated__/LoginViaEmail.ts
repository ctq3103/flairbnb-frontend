/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginViaEmailInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: LoginViaEmail
// ====================================================

export interface LoginViaEmail_loginViaEmail_user {
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

export interface LoginViaEmail_loginViaEmail {
  __typename: "LoginOutput";
  ok: boolean;
  user: LoginViaEmail_loginViaEmail_user;
  token: string | null;
  error: string | null;
}

export interface LoginViaEmail {
  loginViaEmail: LoginViaEmail_loginViaEmail;
}

export interface LoginViaEmailVariables {
  input: LoginViaEmailInput;
}
