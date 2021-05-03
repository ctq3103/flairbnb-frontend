import React from "react";
import moment, { Moment } from "moment";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import {
  Divider,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  Tooltip,
} from "@material-ui/core";
import { useMutation } from "@apollo/client";
import {
  CreateBooking as CreateBookingData,
  CreateBookingVariables,
} from "../../../graphql/__generated__/CreateBooking";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../../../lib/components/toast-message";
import { formatPrice } from "../../../lib/utils/formatPrice";
import { Button } from "../../../lib/components/button";
import { CREATE_BOOKING, USER_QUERY } from "../../../graphql";
import { useMe } from "../../../hooks/useMe";
import { Listing } from "../../../graphql/__generated__/Listing";

interface Props {
  listing: Listing["listing"]["listing"];
  price: number;
  checkInDate: Moment;
  checkOutDate: Moment;
  createBookingModalVisible: boolean;
  setCreateBookingModalVisible: (createBookingModalVisible: boolean) => void;
  clearBookingData: () => void;
  handleListingRefetch: () => Promise<void>;
}

export const ListingCreateBookingModal = ({
  listing,
  price,
  checkInDate,
  checkOutDate,
  createBookingModalVisible,
  setCreateBookingModalVisible,
  clearBookingData,
  handleListingRefetch,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: userData } = useMe();

  const [createBooking, { loading }] = useMutation<
    CreateBookingData,
    CreateBookingVariables
  >(CREATE_BOOKING, {
    onCompleted: (data) => {
      if (data.createBooking.ok) {
        clearBookingData();
        displaySuccessMessage(
          "Your've successfully booked the room! Enjoy your trip!",
        );
        handleListingRefetch();
      } else if (data.createBooking.error) {
        displayErrorMessage(
          "Sorry! We weren't able to book the room. Please try again later!",
        );
      }
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to book the room. Please try again later!",
      );
    },
    refetchQueries: [
      {
        query: USER_QUERY,
        variables: {
          userId: Number(userData?.me.id),
          bookingsPage: 1,
          listingsPage: 1,
          limit: 4,
        },
      },
    ],
  });

  const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
  const listingPrice = price * daysBooked;
  const companyFee = 0.05 * listingPrice;
  const totalPrice = listingPrice + companyFee;

  const handleCreateBooking = async () => {
    if (!stripe || !elements) {
      return displayErrorMessage(
        "Sorry! We weren't able to connect with Stripe!",
      );
    }
    const cardElement = elements.getElement(CardElement);

    let { token: stripeToken, error } = await stripe.createToken(
      cardElement as StripeCardElement,
    );

    if (stripeToken) {
      createBooking({
        variables: {
          input: {
            listingId: listing.id,
            source: stripeToken.id,
            checkIn: moment(checkInDate).format("YYYY-MM-DD"),
            checkOut: moment(checkOutDate).format("YYYY-MM-DD"),
          },
        },
      });
    } else {
      displayErrorMessage(
        error && error.message
          ? error.message
          : "Sorry! We weren't able to book the room. Please try again later!",
      );
    }
  };

  return (
    <div>
      <Dialog open={createBookingModalVisible} keepMounted>
        <DialogTitle>
          <div className="flex justify-between items-center">
            Booking Confirmation
            <IconButton
              aria-label="close"
              onClick={() => setCreateBookingModalVisible(false)}
            >
              <i className="fas fa-times"></i>
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className="space-y-4 text-center">
          <p className="text-gray-500">
            Enter your payment information to book the listing from the dates
            between{" "}
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-emerald-600 bg-emerald-200">
              {moment(checkInDate).format("MMMM Do YYYY")}
            </span>{" "}
            to{" "}
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-emerald-600 bg-emerald-200">
              {moment(checkOutDate).format("MMMM Do YYYY")}
            </span>
            , inclusive.
          </p>
          <Divider />
          <div className="space-y-2 text-gray-600">
            <p>
              {formatPrice(price, false)} x {daysBooked} days ={" "}
              <span className="font-medium">
                {formatPrice(listingPrice, false)}
              </span>
            </p>
            <p>
              Flairbnb fee{" "}
              <Tooltip title="5% of total amount">
                <i className="far fa-question-circle"></i>
              </Tooltip>{" "}
              = <span className="font-medium">{formatPrice(companyFee)}</span>
            </p>
            <p className="text-xl font-medium inline-block py-1 px-2 uppercase rounded text-emerald-600 bg-emerald-200">
              Total = {formatPrice(totalPrice, false)}
            </p>
          </div>
          <Divider />
          <CardElement
            options={{ hidePostalCode: true }}
            className="py-4 px-10"
          />
          <Button
            onClick={handleCreateBooking}
            canClick={true}
            actionText={loading ? "Booking..." : "Book Now"}
          />
          <p className="text-gray-500 text-sm px-6 pb-4 pt-2">
            Test using the credit card number: 4242 4242 4242 4242, a future
            expiry date, and any 3 digits for the CVC code.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};
