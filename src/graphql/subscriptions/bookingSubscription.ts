import { gql } from "@apollo/client";
import { LISTING_FRAGMENT, USER_FRAGMENT } from "../fragments";

export const BOOKING_SUBSCRIPTION = gql`
  subscription BookingSubscription {
    BookingSubscription {
      id
      createdAt
      checkIn
      checkOut
      tenant {
        ...UserParts
      }
      listing {
        ...ListingParts
      }
    }
  }
  ${USER_FRAGMENT}
  ${LISTING_FRAGMENT}
`;
