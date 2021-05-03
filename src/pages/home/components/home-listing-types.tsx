import React from "react";
import { useHistory } from "react-router";
import { ListingType } from "../../../graphql/__generated__/globalTypes";
import entirePlaceImage from "../../../images/entire-place.jpg";
import hotelRoomImage from "../../../images/hotel-room.jpg";
import privatePlaceImage from "../../../images/private-room.jpg";
import sharedPlaceImage from "../../../images/shared-room.jpg";

const LISTING_TYPE = [
  {
    type: ListingType.ENTIRE_PLACE,
    title: "Entire Place",
    imageUrl: entirePlaceImage,
  },
  {
    type: ListingType.HOTEL_ROOM,
    title: "Hotel Room",
    imageUrl: hotelRoomImage,
  },
  {
    type: ListingType.PRIVATE_ROOM,
    title: "Private Room",
    imageUrl: privatePlaceImage,
  },
  {
    type: ListingType.SHARED_ROOM,
    title: "Shared Room",
    imageUrl: sharedPlaceImage,
  },
];

export const HomeListingTypes = () => {
  const history = useHistory();

  return (
    <>
      <p className="text-3xl font-medium my-6">Live Anywhere</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 mb-20 w-full ">
        {LISTING_TYPE.map((listingType, index) => (
          <div
            className="space-y-2 cursor-pointer"
            key={`type-${index}`}
            onClick={() =>
              history.push({
                pathname: "/listings",
                state: {
                  listingType: listingType.type,
                },
              })
            }
          >
            <img
              src={listingType.imageUrl}
              alt={listingType.title}
              className="w-full h-48 object-cover rounded"
            />
            <div className="text-xl font-medium">{listingType.title}</div>
          </div>
        ))}
      </div>
    </>
  );
};
