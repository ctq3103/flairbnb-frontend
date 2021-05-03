import React from "react";
import { ListingCard } from "../../../lib/components/listing-card";
import { User } from "../../../graphql/__generated__/User";
import { Pagination } from "../../../lib/components/pagination";

interface Props {
  userBookings: User["userProfile"]["user"]["bookings"];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (page: number) => void;
}

export const UserBookings = ({
  userBookings,
  bookingsPage,
  limit,
  setBookingsPage,
}: Props) => {
  const totalPages = userBookings.totalPages;
  const bookingsSection = userBookings.result.length ? (
    userBookings.result.map((listing) => {
      return (
        <ListingCard
          key={listing.id}
          listing={listing.listing}
          checkIn={listing.checkIn}
          checkOut={listing.checkOut}
        />
      );
    })
  ) : (
    <div className="md:col-span-2 lg:col-span-4 text-center h-28 text-gray-500">
      User doesn't have any bookings yet!
    </div>
  );

  return (
    <div className="container flex flex-col items-start">
      <h3 className="flex-shrink-0 uppercase font-medium text-3xl my-3">
        Bookings
      </h3>
      <p className="text-sm mb-6">
        This section highlights the bookings this user currently hosts and has
        made available for bookings.
      </p>
      {totalPages > 1 && (
        <Pagination
          currentPage={bookingsPage}
          totalPages={totalPages}
          setPage={setBookingsPage}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-5 w-full">
        {bookingsSection}
      </div>
    </div>
  );
};
