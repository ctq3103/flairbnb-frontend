//-listing-images
//-listing-details
//listing-bookings
//listing-createbooking
//listing-createBookingModal
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { Moment } from "moment";
import { ListingCreateBooking } from "./components/listing-create-booking";
import { ListingDetails } from "./components/listing-details";
import { ListingImages } from "./components/listing-images";
import { ErrorBanner } from "../../lib/components/error-banner";
import { PageSkeleton } from "../../lib/components/page-skeleton";
import { useMe } from "../../hooks/useMe";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../__generated__/Listing";
import { ListingCreateBookingModal } from "./components/listing-create-booking-modal";
import { ListingBookings } from "./components/listing-bookings";
import { LISTING_FRAGMENT, USER_FRAGMENT } from "../../fragments";

const LISTING = gql`
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

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 3;

export const Listing = () => {
  const { id } = useParams<MatchParams>();
  const { data: meData } = useMe();

  const [bookingsPage, setBookingsPage] = useState(0);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const clearBookingData = () => {
    setModalVisible(true);
    setCheckInDate(null);
    setCheckOutDate(null);
  };

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
    <ListingImages images={listing.images} />
  ) : null;

  const listingDetailsElement = listing ? (
    <ListingDetails isMyProfile={isMyProfile} listing={listing} />
  ) : null;

  const listingBookingsElement =
    isMyProfile && listingBookings ? (
      <ListingBookings
        listingBookings={listingBookings}
        bookingsPage={bookingsPage}
        limit={PAGE_LIMIT}
        setBookingsPage={setBookingsPage}
      />
    ) : null;

  const listingCreateBooking = listing ? (
    <ListingCreateBooking
      isMyProfile={isMyProfile}
      meId={meData?.me.id}
      host={listing.host}
      price={listing.price}
      checkInDate={checkInDate}
      setCheckInDate={setCheckInDate}
      checkOutDate={checkOutDate}
      setCheckOutDate={setCheckOutDate}
      bookingsIndex={listing.bookingsIndex}
      setModalVisible={setModalVisible}
    />
  ) : null;

  const listingCreateBookingModal = listing && checkInDate && checkOutDate && (
    <ListingCreateBookingModal
      listingId={listing.id}
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      clearBookingData={clearBookingData}
      handleListingRefetch={handleListingRefetch}
    />
  );

  return (
    <>
      <Helmet>
        <title>{listing?.title} | Flairbnb</title>
      </Helmet>
      {listingImagesElement}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {listingDetailsElement}
        {listingCreateBooking}
      </div>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 my-12 ">
        {listingBookingsElement}
      </div>
      {listingCreateBookingModal}
    </>
  );
};
