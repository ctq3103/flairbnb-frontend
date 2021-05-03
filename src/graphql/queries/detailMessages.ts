import { gql } from "@apollo/client";
import { MESSAGE_FRAGMENT } from "../fragments";

export const DETAIL_MESSAGES = gql`
  query DetailMessages($participantId: Int!) {
    detailMessages(input: { participantId: $participantId }) {
      ok
      error
      messages {
        ...MessageParts
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;
