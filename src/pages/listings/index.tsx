import { useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { ErrorBanner } from "../../lib/components/error-banner";
import { ListingsSkeleton } from "./components/listings-skeleton";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import {
  ListingsFilter,
  ListingType,
} from "../../graphql/__generated__/globalTypes";
import {
  ListingsPriceFilterOptions,
  ListingsTypeFilterOptions,
} from "./components/listings-filter";
import { Pagination } from "../../lib/components/pagination";
import { ListingCard } from "../../lib/components/listing-card";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../graphql/__generated__/Listings";
import { LISTINGS } from "../../graphql";
import { Helmet } from "react-helmet-async";

interface MatchParams {
  location: string;
}
interface MatchLocation {
  listingType?: ListingType;
}

const PAGE_LIMIT = 6;

export const Listings = () => {
  const { location } = useParams<MatchParams>();
  const { state } = useLocation<MatchLocation>();
  const locationRef = useRef(location);
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(0);
  const [type, setType] = useState<ListingType | undefined>(
    state && state.listingType ? state.listingType : undefined,
  );

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
        type,
      },
    },
  );

  useEffect(() => {
    setPage(0);
    locationRef.current = location;
  }, [location, locationRef]);

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

  const listingsSectionElement = (
    <>
      <div className="sticky top-20 z-10 bg-white -mx-10 h-20 pb-8 pt-4 px-10 flex justify-between items-center">
        <div className="space-x-4">
          <ListingsPriceFilterOptions filter={filter} setFilter={setFilter} />
          <ListingsTypeFilterOptions type={type} setType={setType} />
        </div>
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            setPage={setPage}
          />
        )}
      </div>

      {listings && listings.result.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-5 w-full">
            {listings.result.map((listing) => {
              return <ListingCard key={listing.id} listing={listing} />;
            })}
          </div>
        </>
      ) : (
        <div>
          No listing is found for{" "}
          <span className="font-medium text-rose-600">
            {listingsRegion || (type && type.replace(/_/g, " "))}
          </span>
        </div>
      )}
    </>
  );

  const listingsRegionElement = listings?.region && (
    <div className="text-2xl font-medium text-rose-600 py-4">
      Results for "{listingsRegion}"
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Rooms | Flairbnb</title>
      </Helmet>
      {listingsRegionElement}
      {listingsSectionElement}
    </>
  );
};
