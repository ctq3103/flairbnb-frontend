import { gql } from "@apollo/client";

export const LISTING_FRAGMENT = gql`
  fragment ListingParts on Listing {
    id
    title
    description
    images
    type
    address
    country
    admin
    city
    price
    numOfGuests
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserParts on User {
    id
    createdAt
    name
    email
    avatar
    emailVerified
    hasWallet
    income
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageParts on Message {
    id
    createdAt
    content
    fromId
    toId
  }
`;
