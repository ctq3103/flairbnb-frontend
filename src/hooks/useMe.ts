import { gql, useQuery } from "@apollo/client";
import { USER_FRAGMENT } from "../fragments";
import { Me } from "../__generated__/Me";

export const ME_QUERY = gql`
  query Me {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

export const useMe = () => {
  return useQuery<Me>(ME_QUERY);
};
