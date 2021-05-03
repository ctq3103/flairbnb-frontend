import React from "react";
import { Link } from "react-router-dom";
import { ImageAvatar, LetterAvatar } from "../../../lib/components/avatar";
import { Pagination } from "../../../lib/components/pagination";
import { Listing } from "../../../graphql/__generated__/Listing";

interface Props {
  listingBookings: Listing["listing"]["listing"]["bookings"];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (page: number) => void;
}

export const ListingBookings = ({
  listingBookings,
  bookingsPage,
  limit,
  setBookingsPage,
}: Props) => {
  const totalPages = listingBookings.totalPages;

  const bookingsSection = listingBookings.result.length ? (
    listingBookings.result.map((booking) => {
      const { checkIn, checkOut, tenant } = booking;

      return (
        <div className="shadow p-4 space-y-2">
          <p>
            Check In: <span className="font-medium">{checkIn}</span>
          </p>
          <p>
            Check Out: <span className="font-medium">{checkOut}</span>
          </p>
          <Link
            to={`/profile/${tenant.id}`}
            className="flex items-center space-x-2"
          >
            {tenant.avatar ? (
              <ImageAvatar size="small" imageUrl={tenant.avatar} />
            ) : (
              <LetterAvatar
                size="small"
                letter={tenant.name.charAt(0).toUpperCase()}
              />
            )}
            <span className="text-gray-500 font-medium">{tenant.name}</span>
          </Link>
        </div>
      );
    })
  ) : (
    <div className="md:col-span-2 lg:col-span-4 h-28 text-gray-500">
      This room doesn't have any bookings yet!
    </div>
  );

  return (
    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
      <h3 className="flex-shrink-0 uppercase font-medium text-xl my-3">
        Bookings
      </h3>

      {totalPages > 1 && (
        <Pagination
          currentPage={bookingsPage}
          totalPages={totalPages}
          setPage={setBookingsPage}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8 w-full">
        {bookingsSection}
      </div>
    </div>
  );
};
