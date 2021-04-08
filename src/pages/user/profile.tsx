import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { ErrorBanner } from "../../lib/components/error-banner";
import { PageSkeleton } from "../../lib/components/page-skeleton";
import { UserBookings } from "./components/user-bookings";
import { UserListings } from "./components/user-listings";
import { UserProfile } from "./components/user-profile";
import { useMe } from "../../hooks/useMe";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { User as UserData, UserVariables } from "../../__generated__/User";
import { LISTING_FRAGMENT, USER_FRAGMENT } from "../../fragments";

const USER_QUERY = gql`
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

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 4;

export const Profile = () => {
  const { id } = useParams<MatchParams>();
  const { data: meData } = useMe();

  const [bookingsPage, setBookingsPage] = useState(0);
  const [listingsPage, setListingsPage] = useState(0);

  useScrollToTop();

  const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(
    USER_QUERY,
    {
      variables: {
        userId: Number(id),
        bookingsPage: bookingsPage + 1,
        listingsPage: listingsPage + 1,
        limit: PAGE_LIMIT,
      },
    },
  );

  const handleUserRefetch = async () => {
    await refetch();
  };

  const user = data?.userProfile.user;
  const isMyProfile = meData?.me.id === Number(id);

  const userBookings = user ? user.bookings : null;
  const userListings = user ? user.listings : null;

  const stripeError = new URL(window.location.href).searchParams.get(
    "stripe_error",
  );

  const stripeErrorBanner = isMyProfile && stripeError && (
    <ErrorBanner message="We had an issue connecting with Stripe. Please try again soon!" />
  );

  const emailVerifiedBanner = isMyProfile && !meData?.me.emailVerified && (
    <ErrorBanner message="Please check your email to verify your account" />
  );

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <>
        <ErrorBanner message="This user may not exist or we've encountered an error. Please try again!" />
        <PageSkeleton />
      </>
    );
  }

  const userProfileElement = user ? (
    <UserProfile
      user={user}
      isMyProfile={isMyProfile}
      handleUserRefetch={handleUserRefetch}
    />
  ) : null;

  const userListingsElement = userListings ? (
    <UserListings
      userListings={userListings}
      listingsPage={listingsPage}
      limit={PAGE_LIMIT}
      setListingsPage={setListingsPage}
    />
  ) : null;

  const userBookingsElement = userBookings ? (
    <UserBookings
      userBookings={userBookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  return (
    <>
      <Helmet>
        <title>{user?.name}'s Profile | Flairbnb</title>
      </Helmet>
      {isMyProfile && emailVerifiedBanner}
      {isMyProfile && stripeErrorBanner}
      {userProfileElement}
      {isMyProfile && userBookingsElement}
      {userListingsElement}
    </>
  );
};
