import { gql, useQuery } from "@apollo/client";
import { Me } from "../__generated__/Me";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      hasWallet
      role
      emailVerified
    }
  }
`;

export const useMe = () => {
  return useQuery<Me>(ME_QUERY);
};
