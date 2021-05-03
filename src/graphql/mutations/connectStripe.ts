import { gql } from "@apollo/client";

export const CONNECT_STRIPE = gql`
  mutation ConnectStripe($code: String!) {
    connectStripe(input: { code: $code }) {
      ok
      error
    }
  }
`;
