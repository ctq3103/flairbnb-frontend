import { useQuery } from "@apollo/client";
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
} from "../../graphql/__generated__/Listing";
import { ListingCreateBookingModal } from "./components/listing-create-booking-modal";
import { ListingBookings } from "./components/listing-bookings";
import { LISTING } from "../../graphql";
import { ListingContactHostModal } from "./components/listing-contact-host-modal";

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
  const [createBookingModalVisible, setCreateBookingModalVisible] = useState(
    false,
  );
  const [contactHostModalVisible, setContactHostModalVisible] = useState(false);

  useScrollToTop();

  const { data, loading, error, refetch } = useQuery<
    ListingData,
    ListingVariables
  >(LISTING, {
    variables: {
      id: Number(id),
      limit: PAGE_LIMIT,
      page: bookingsPage + 1,
    },
  });

  const clearBookingData = () => {
    setCreateBookingModalVisible(false);
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
    <ListingDetails
      isMyProfile={isMyProfile}
      listing={listing}
      contactHostModalVisible={contactHostModalVisible}
      setContactHostModalVisible={setContactHostModalVisible}
    />
  ) : null;

  const listingContactHostModalElement = listing ? (
    <ListingContactHostModal
      hostId={listing.host.id}
      contactHostModalVisible={contactHostModalVisible}
      setContactHostModalVisible={setContactHostModalVisible}
    />
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
      setCreateBookingModalVisible={setCreateBookingModalVisible}
    />
  ) : null;

  const listingCreateBookingModal = listing && checkInDate && checkOutDate && (
    <ListingCreateBookingModal
      listing={listing}
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      createBookingModalVisible={createBookingModalVisible}
      setCreateBookingModalVisible={setCreateBookingModalVisible}
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
      {listingContactHostModalElement}
    </>
  );
};
