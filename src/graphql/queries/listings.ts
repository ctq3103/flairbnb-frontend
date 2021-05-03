import { gql } from "@apollo/client";
import { LISTING_FRAGMENT } from "../fragments";

export const LISTINGS = gql`
  query Listings(
    $location: String
    $filter: ListingsFilter!
    $limit: Int!
    $page: Int!
    $type: ListingType
  ) {
    listings(
      input: {
        location: $location
        filter: $filter
        limit: $limit
        page: $page
        type: $type
      }
    ) {
      ok
      error
      region
      totalPages
      totalResults
      result {
        ...ListingParts
      }
    }
  }
  ${LISTING_FRAGMENT}
`;
