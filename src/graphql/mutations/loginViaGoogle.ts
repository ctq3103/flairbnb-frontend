import { gql } from "@apollo/client";
import { USER_FRAGMENT } from "../fragments";

export const LOGIN_VIA_GOOGLE = gql`
  mutation LoginViaGoogle($code: String!) {
    loginViaGoogle(input: { code: $code }) {
      ok
      user {
        ...UserParts
      }
      error
      token
    }
  }
  ${USER_FRAGMENT}
`;

export const GOOGLE_AUTH_URL = gql`
  query GoogleAuthUrl {
    googleAuthUrl
  }
`;
