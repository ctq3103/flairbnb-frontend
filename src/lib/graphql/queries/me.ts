import { gql } from "@apollo/client";
import { USER_FRAGMENT } from "../../../fragments";

export const ME_QUERY = gql`
  query Me {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;
