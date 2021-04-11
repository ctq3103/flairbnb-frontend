import { gql } from "@apollo/client";
import { LISTING_FRAGMENT, USER_FRAGMENT } from "../../../fragments";

export const LISTING = gql`
  query Listing($id: Int!, $limit: Int!, $page: Int!) {
    listing(input: { listingId: $id }) {
      ok
      error
      listing {
        ...ListingParts
        bookingsIndex
        bookings(input: { limit: $limit, page: $page }) {
          ok
          error
          totalPages
          totalResults
          result {
            tenant {
              ...UserParts
            }
            checkIn
            checkOut
          }
        }
        host {
          ...UserParts
        }
      }
    }
  }
  ${LISTING_FRAGMENT}
  ${USER_FRAGMENT}
`;
