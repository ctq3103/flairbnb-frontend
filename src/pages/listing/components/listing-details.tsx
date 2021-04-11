import React from "react";
import { Link } from "react-router-dom";
import { Listing } from "../../../__generated__/Listing";
import { ImageAvatar, LetterAvatar } from "../../../lib/components/avatar";
import { Divider } from "@material-ui/core";

interface Props {
  listing: Listing["listing"]["listing"];
  isMyProfile: boolean;
}

export const ListingDetails = ({ listing, isMyProfile }: Props) => {
  const {
    title,
    description,
    type,
    address,
    admin,
    numOfGuests,
    host,
  } = listing;

  const avatarSection = host?.avatar ? (
    <ImageAvatar size="medium" imageUrl={host.avatar} />
  ) : (
    <LetterAvatar
      size="medium"
      letter={host?.name.charAt(0).toUpperCase() as string}
    />
  );

  return (
    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
      <div>
        <span className="text-gray-500 font-light">
          <span className="text-rose-500 mr-2 space-x-1 font-medium">
            <i className=" fas fa-map-marker-alt"></i> {admin}
          </span>
          | {address}
        </span>
        <h4 className="text-2xl font-medium mt-4">{title}</h4>
      </div>

      <Divider />
      {/* flex-row md:flex md:justify-between md:items-center  */}
      <div className="grid grid-cols-1 md:grid-cols-4 text-center space-y-8 md:space-y-0 items-center">
        <Link
          to={`/profile/${host.id}`}
          className="flex md:col-span-3 space-x-5"
        >
          {avatarSection}
          <div
            style={{
              fontFamily: "Mrs Saint Delafield",
            }}
            className="text-5xl pt-4"
          >
            {host.name}
          </div>
        </Link>
        {!isMyProfile && <button className="btn-outline">Contact host</button>}
      </div>

      <Divider />

      <div className="">
        <span className="text-xs font-semibold inline-block py-1 px-2  rounded-full text-rose-600 bg-rose-200 uppercase last:mr-0 mr-1">
          {type.replace(/_/g, " ")}
        </span>
        <span className="text-xs font-semibold inline-block py-1 px-2  rounded-full text-rose-600 bg-rose-200 uppercase last:mr-0 mr-1">
          {numOfGuests} guest{numOfGuests > 1 && "s"}
        </span>
      </div>
      <div>{description}</div>
    </div>
  );
};
