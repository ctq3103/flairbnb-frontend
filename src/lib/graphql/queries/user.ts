import { gql } from "@apollo/client";
import { LISTING_FRAGMENT, USER_FRAGMENT } from "../../../fragments";

export const USER_QUERY = gql`
  query User(
    $userId: Int!
    $bookingsPage: Int!
    $listingsPage: Int!
    $limit: Int!
  ) {
    userProfile(input: { userId: $userId }) {
      ok
      error
      user {
        ...UserParts
        bookings(input: { limit: $limit, page: $bookingsPage }) {
          ok
          error
          totalPages
          totalResults
          result {
            id
            listing {
              ...ListingParts
            }
            checkIn
            checkOut
          }
        }
        listings(input: { limit: $limit, page: $listingsPage }) {
          ok
          error
          totalPages
          totalResults
          result {
            ...ListingParts
          }
        }
      }
    }
  }
  ${LISTING_FRAGMENT}
  ${USER_FRAGMENT}
`;
