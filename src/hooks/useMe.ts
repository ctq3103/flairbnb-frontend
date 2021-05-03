import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../graphql/queries/me";
import { Me } from "../graphql/__generated__/Me";

export const useMe = () => {
  return useQuery<Me>(ME_QUERY);
};
