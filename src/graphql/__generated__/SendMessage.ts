/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendMessage
// ====================================================

export interface SendMessage_sendMessage_message_chatroom {
  __typename: "Chatroom";
  id: number;
}

export interface SendMessage_sendMessage_message {
  __typename: "Message";
  id: number;
  createdAt: any;
  content: string;
  fromId: number;
  toId: number;
  chatroom: SendMessage_sendMessage_message_chatroom;
}

export interface SendMessage_sendMessage {
  __typename: "SendMessageOutput";
  ok: boolean;
  error: string | null;
  message: SendMessage_sendMessage_message | null;
}

export interface SendMessage {
  sendMessage: SendMessage_sendMessage;
}

export interface SendMessageVariables {
  content: string;
  participantId: number;
}
