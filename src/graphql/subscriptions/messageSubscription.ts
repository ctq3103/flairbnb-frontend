import { gql } from "@apollo/client";
import { MESSAGE_FRAGMENT } from "../fragments";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageSubscription {
    MessageSubscription {
      ...MessageParts
    }
  }
  ${MESSAGE_FRAGMENT}
`;
