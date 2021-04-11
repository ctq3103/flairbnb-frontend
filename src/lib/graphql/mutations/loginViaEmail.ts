import { gql } from "@apollo/client";
import { USER_FRAGMENT } from "../../../fragments";

export const LOGIN_VIA_EMAIL = gql`
  mutation LoginViaEmail($input: LoginViaEmailInput!) {
    loginViaEmail(input: $input) {
      ok
      user {
        ...UserParts
      }
      token
      error
    }
  }
  ${USER_FRAGMENT}
`;
