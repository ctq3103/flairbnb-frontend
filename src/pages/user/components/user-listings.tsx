import React from "react";
import { User } from "../../../graphql/__generated__/User";
import { ListingCard } from "../../../lib/components/listing-card";
import { Pagination } from "../../../lib/components/pagination";

interface Props {
  userListings: User["userProfile"]["user"]["listings"];
  listingsPage: number;
  limit: number;
  setListingsPage: (page: number) => void;
}

export const UserListings = ({
  userListings,
  listingsPage,
  limit,
  setListingsPage,
}: Props) => {
  const totalPages = userListings.totalPages;
  const listingsSection = userListings.result.length ? (
    userListings.result.map((listing) => {
      return <ListingCard key={listing.id} listing={listing} />;
    })
  ) : (
    <div className="md:col-span-2 lg:col-span-4 text-center h-28 text-gray-500">
      User doesn't have any listings yet!
    </div>
  );

  return (
    <div className="container flex flex-col items-start">
      <h3 className="flex-shrink-0 uppercase font-medium text-3xl my-3">
        Listings
      </h3>
      <p className="text-sm mb-6">
        This section highlights the listings this user currently hosts and has
        made available for bookings.
      </p>
      {totalPages > 1 && (
        <Pagination
          currentPage={listingsPage}
          totalPages={totalPages}
          setPage={setListingsPage}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-8 w-full">
        {listingsSection}
      </div>
    </div>
  );
};
