/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginViaGoogle
// ====================================================

export interface LoginViaGoogle_loginViaGoogle {
  __typename: "LoginOutput";
  ok: boolean;
  id: number | null;
  error: string | null;
  token: string | null;
}

export interface LoginViaGoogle {
  loginViaGoogle: LoginViaGoogle_loginViaGoogle;
}

export interface LoginViaGoogleVariables {
  code: string;
}
