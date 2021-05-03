import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { ErrorBanner } from "../../lib/components/error-banner";
import { PageSkeleton } from "../../lib/components/page-skeleton";
import { UserBookings } from "./components/user-bookings";
import { UserListings } from "./components/user-listings";
import { UserProfile } from "./components/user-profile";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import {
  User as UserData,
  UserVariables,
} from "../../graphql/__generated__/User";
import { USER_QUERY } from "../../graphql";
import { Me } from "../../graphql/__generated__/Me";

interface Props {
  me: Me | undefined;
}

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 4;

export const Profile = ({ me }: Props) => {
  const { id } = useParams<MatchParams>();

  const [bookingsPage, setBookingsPage] = useState(0);
  const [listingsPage, setListingsPage] = useState(0);

  useScrollToTop();

  const { data, loading, error } = useQuery<UserData, UserVariables>(
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

  const user = data?.userProfile.user;
  const isMyProfile = me?.me.id === Number(id);

  const userBookings = user ? user.bookings : null;
  const userListings = user ? user.listings : null;

  const stripeError = new URL(window.location.href).searchParams.get(
    "stripe_error",
  );

  const stripeErrorBanner = isMyProfile && stripeError && (
    <ErrorBanner message="We had an issue connecting with Stripe. Please try again soon!" />
  );

  const emailVerifiedBanner = isMyProfile && !me?.me.emailVerified && (
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
    <UserProfile user={user} isMyProfile={isMyProfile} />
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
