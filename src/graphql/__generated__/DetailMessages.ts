/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DetailMessages
// ====================================================

export interface DetailMessages_detailMessages_messages {
  __typename: "Message";
  id: number;
  createdAt: any;
  content: string;
  fromId: number;
  toId: number;
}

export interface DetailMessages_detailMessages {
  __typename: "DetailMessagesOutput";
  ok: boolean;
  error: string | null;
  messages: DetailMessages_detailMessages_messages[] | null;
}

export interface DetailMessages {
  detailMessages: DetailMessages_detailMessages;
}

export interface DetailMessagesVariables {
  participantId: number;
}
