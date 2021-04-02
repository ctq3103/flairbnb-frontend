/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateAccountInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateAccount
// ====================================================

export interface CreateAccount_createAccount {
  __typename: "CreateAccountOutput";
  ok: boolean;
  error: string | null;
}

export interface CreateAccount {
  createAccount: CreateAccount_createAccount;
}

export interface CreateAccountVariables {
  input: CreateAccountInput;
}
