/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PreviewMessages
// ====================================================

export interface PreviewMessages_previewMessages_previewMessages_participant {
  __typename: "User";
  id: number;
  createdAt: any;
  name: string;
  email: string;
  avatar: string | null;
  emailVerified: boolean;
  hasWallet: boolean;
  income: number;
}

export interface PreviewMessages_previewMessages_previewMessages_latestMessage {
  __typename: "Message";
  id: number;
  createdAt: any;
  content: string;
  fromId: number;
  toId: number;
}

export interface PreviewMessages_previewMessages_previewMessages {
  __typename: "SinglePreviewMessage";
  participant: PreviewMessages_previewMessages_previewMessages_participant;
  latestMessage: PreviewMessages_previewMessages_previewMessages_latestMessage;
}

export interface PreviewMessages_previewMessages {
  __typename: "PreviewMessagesOutput";
  ok: boolean;
  error: string | null;
  previewMessages: PreviewMessages_previewMessages_previewMessages[] | null;
}

export interface PreviewMessages {
  previewMessages: PreviewMessages_previewMessages;
}
