import { gql } from "@apollo/client";
import { MESSAGE_FRAGMENT } from "../fragments";

export const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $participantId: Int!) {
    sendMessage(input: { content: $content, participantId: $participantId }) {
      ok
      error
      message {
        ...MessageParts
        chatroom {
          id
        }
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;
