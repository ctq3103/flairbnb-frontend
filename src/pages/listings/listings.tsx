import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { ErrorBanner } from "../../components/reusable/error-banner";
import { ListingsSkeleton } from "../../components/listings/listings-skeleton";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { ListingsFilter } from "../../__generated__/globalTypes";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../__generated__/Listings";
import { ListingsFilterOptions } from "../../components/listings/listings-filter";
import { Pagination } from "../../components/reusable/pagination";
import { ListingCard } from "../../components/reusable/listing-card";

export const LISTINGS = gql`
  query Listings(
    $location: String
    $filter: ListingsFilter!
    $limit: Int!
    $page: Int!
  ) {
    listings(
      input: {
        location: $location
        filter: $filter
        limit: $limit
        page: $page
      }
    ) {
      ok
      error
      region
      totalPages
      totalResults
      result {
        id
        title
        image
        address
        admin
        country
        price
        numOfGuests
      }
    }
  }
`;

interface MatchParams {
  location: string;
}

const PAGE_LIMIT = 6;

export const Listings = () => {
  const { location } = useParams<MatchParams>();

  const locationRef = useRef(location);
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(0);

  useScrollToTop();

  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      skip: locationRef.current !== location && page !== 0,
      variables: {
        location,
        filter,
        limit: PAGE_LIMIT,
        page: page + 1,
      },
    },
  );

  useEffect(() => {
    setPage(0);
    locationRef.current = location;
  }, [location]);

  if (loading) {
    return <ListingsSkeleton />;
  }

  if (error) {
    return (
      <>
        <ErrorBanner message="We either couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common keywords." />
        <ListingsSkeleton />
      </>
    );
  }

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;
  const totalPages = data ? data.listings.totalPages : 0;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <>
        <div className="sticky top-20 z-10 bg-white -mx-10 h-20 pb-8 pt-4 px-10 flex justify-between items-center">
          <ListingsFilterOptions filter={filter} setFilter={setFilter} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              setPage={setPage}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-5 w-full">
          {listings.result.map((listing) => {
            return <ListingCard key={listing.id} listing={listing} />;
          })}
        </div>
      </>
    ) : (
      <div>
        No listing is found for{" "}
        <span className="font-medium text-rose-600">{listingsRegion}</span>
      </div>
    );

  const listingsRegionElement = listings?.region && (
    <div className="text-2xl font-medium text-rose-600 py-4">
      Results for "{listingsRegion}"
    </div>
  );

  return (
    <>
      {listingsRegionElement}
      {listingsSectionElement}
    </>
  );
};
