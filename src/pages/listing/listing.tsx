//-listing-images
//-listing-details
//listing-bookings
//listing-createbooking
//listing-createBookingModal
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { ListingCreateBooking } from "../../components/listing/listing-create-booking";
import { ListingDetails } from "../../components/listing/listing-details";
import { ListingImages } from "../../components/listing/listing-images";
import { ErrorBanner } from "../../components/reusable/error-banner";
import { PageSkeleton } from "../../components/reusable/page-skeleton";
import { useMe } from "../../hooks/useMe";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../__generated__/Listing";

const LISTING = gql`
  query Listing($id: Int!, $limit: Int!, $page: Int!) {
    listing(input: { listingId: $id }) {
      ok
      error
      listing {
        title
        description
        image
        type
        address
        country
        admin
        city
        price
        numOfGuests
        bookingsIndex
        bookings(input: { limit: $limit, page: $page }) {
          ok
          error
          totalPages
          totalResults
          result {
            tenant {
              id
              name
              avatar
            }
            checkIn
            checkOut
          }
        }
        host {
          id
          name
          email
          avatar
          emailVerified
          hasWallet
        }
      }
    }
  }
`;

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 3;

export const Listing = () => {
  const { id } = useParams<MatchParams>();
  const { data: meData } = useMe();

  const [bookingsPage, setBookingsPage] = useState(0);

  useScrollToTop();

  const { data, loading, error, refetch } = useQuery<
    ListingData,
    ListingVariables
  >(LISTING, {
    variables: {
      id: Number(id),
      limit: PAGE_LIMIT,
      page: bookingsPage + 0,
    },
  });

  const handleListingRefetch = async () => {
    await refetch();
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <>
        <ErrorBanner message="This listing may not exist or we've encountered an error. Please try again!" />
        <PageSkeleton />
      </>
    );
  }

  const listing = data ? data.listing.listing : null;
  const listingBookings = listing ? listing.bookings : null;
  const isMyProfile = meData?.me.id === listing?.host.id;

  const listingImagesElement = listing ? (
    <ListingImages image={listing.image} />
  ) : null;

  const listingDetailsElement = listing ? (
    <ListingDetails isMyProfile={isMyProfile} listing={listing} />
  ) : null;

  return (
    <>
      <Helmet>
        <title>Listing | Flairbnb</title>
      </Helmet>
      {listingImagesElement}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 mb-44">
        {listingDetailsElement}
        <ListingCreateBooking />
      </div>
    </>
  );
};

//lg:flex lg:justify-around space-y-12
