import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../lib/graphql/queries/me";
import { Me } from "../__generated__/Me";

export const useMe = () => {
  return useQuery<Me>(ME_QUERY);
};
