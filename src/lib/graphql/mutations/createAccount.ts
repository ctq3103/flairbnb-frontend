import { gql } from "@apollo/client";

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;
