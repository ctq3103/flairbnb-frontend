/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: MessageSubscription
// ====================================================

export interface MessageSubscription_MessageSubscription {
  __typename: "Message";
  id: number;
  createdAt: any;
  content: string;
  fromId: number;
  toId: number;
}

export interface MessageSubscription {
  MessageSubscription: MessageSubscription_MessageSubscription;
}
