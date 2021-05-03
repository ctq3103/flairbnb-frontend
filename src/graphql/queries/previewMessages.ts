import { gql } from "@apollo/client";
import { MESSAGE_FRAGMENT, USER_FRAGMENT } from "../fragments";

export const PREVIEW_MESSAGES = gql`
  query PreviewMessages {
    previewMessages {
      ok
      error
      previewMessages {
        participant {
          ...UserParts
        }
        latestMessage {
          ...MessageParts
        }
      }
    }
  }
  ${MESSAGE_FRAGMENT}
  ${USER_FRAGMENT}
`;
