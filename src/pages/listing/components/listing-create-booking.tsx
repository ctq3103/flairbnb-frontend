import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment, { Moment } from "moment";
import { Divider } from "@material-ui/core";
import { Listing as ListingData } from "../../../graphql/__generated__/Listing";
import { Button } from "../../../lib/components/button";
import { formatPrice } from "../../../lib/utils/formatPrice";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { displayErrorMessage } from "../../../lib/components/toast-message";
import { Me } from "../../../graphql/__generated__/Me";

interface Props {
  isMyProfile: boolean;
  me: Me["me"] | undefined;
  host: ListingData["listing"]["listing"]["host"];
  bookingsIndex: ListingData["listing"]["listing"]["bookingsIndex"];
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
  setCreateBookingModalVisible: (createBookingModalVisible: boolean) => void;
}

interface BookingsIndexMonth {
  [key: string]: boolean;
}
interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}
interface BookingsIndex {
  [key: string]: BookingsIndexYear;
}

export const ListingCreateBooking = ({
  isMyProfile,
  me,
  host,
  bookingsIndex,
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  setCreateBookingModalVisible,
}: Props) => {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#F43F5E",
      },
    },
  });

  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

  const dateIsBooked = (currentDate?: Moment) => {
    const year = moment(currentDate).year();
    const month = moment(currentDate).month();
    const day = moment(currentDate).date();

    if (
      bookingsIndexJSON &&
      bookingsIndexJSON[year] &&
      bookingsIndexJSON[year][month]
    ) {
      return Boolean(bookingsIndexJSON[year][month][day]);
    } else {
      return false;
    }
  };

  const disabledDate = (currentDate?: MaterialUiPickersDate) => {
    if (currentDate) {
      const dateIsTodayAndBeforeToday = currentDate.isSameOrBefore(
        moment().endOf("day"),
      );

      const dateIsMoreThanThreeMonthsAhead = moment(currentDate).isAfter(
        moment().endOf("day").add(90, "days"),
      );

      return (
        dateIsTodayAndBeforeToday ||
        dateIsMoreThanThreeMonthsAhead ||
        dateIsBooked(currentDate)
      );
    } else {
      return false;
    }
  };

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
        return displayErrorMessage(
          "Check Out Date must be after Check In Date. Please try again!",
        );
      }

      if (
        moment(selectedCheckOutDate).isAfter(
          moment(checkInDate).endOf("day").add(14, "days"),
        )
      ) {
        return displayErrorMessage(
          "Check Out Date must not more than 2 weeks from Check In Date. Please try again!",
        );
      }

      let dateCursor = checkInDate;

      while (moment(dateCursor).isBefore(selectedCheckOutDate, "days")) {
        dateCursor = moment(dateCursor).add(1, "days");

        const year = moment(dateCursor).year();
        const month = moment(dateCursor).month();
        const day = moment(dateCursor).date();

        if (
          bookingsIndexJSON &&
          bookingsIndexJSON[year] &&
          bookingsIndexJSON[year][month] &&
          bookingsIndexJSON[year][month][day]
        ) {
          return displayErrorMessage(
            "You cannot book a period of time that overlaps existing bookings. Please try again!",
          );
        }
      }
    }

    setCheckOutDate(selectedCheckOutDate);
  };

  const checkInInputDisabled =
    !me || !me.hasWallet || isMyProfile || !host.hasWallet;
  const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
  const buttonDisabled = checkOutInputDisabled || !checkInDate || !checkOutDate;

  let buttonMessage = "You won't be charged yet";

  if (!me) {
    buttonMessage = "You have to be signed in to book a room!";
  } else if (!me.hasWallet) {
    buttonMessage = "You have to connect with Stripe to book a room!";
  } else if (isMyProfile) {
    buttonMessage = "You cannot book your own room!";
  } else if (!host.hasWallet) {
    buttonMessage =
      "The host has disconnected from Stripe and thus won't be able to receive payments";
  }

  return (
    <div className="lg:col-span-1 text-center border border-gray-200 rounded px-4 py-10 space-y-10 shadow hover:shadow-lg">
      <div className="font-medium text-xl text-gray-400">
        <span className="text-rose-500 text-3xl">{formatPrice(price)}</span>
        /night
      </div>
      <Divider />
      <ThemeProvider theme={theme}>
        <div className="space-y-14">
          <KeyboardDatePicker
            label="Check In Date"
            value={checkInDate ? checkInDate : undefined}
            onChange={(dateValue) => setCheckInDate(dateValue)}
            onOpen={() => setCheckOutDate(null)}
            minDate={new Date()}
            maxDate={moment().endOf("day").add(90, "days")}
            disablePast
            shouldDisableDate={disabledDate}
            inputVariant="outlined"
            autoOk
            format="YYYY/MM/DD"
            maskChar="_"
          />

          <KeyboardDatePicker
            label="Check Out Date"
            value={checkOutDate ? checkOutDate : undefined}
            onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
            minDate={moment(checkInDate)}
            minDateMessage="Check-out cannot be before check-in"
            disablePast
            shouldDisableDate={disabledDate}
            inputVariant="outlined"
            autoOk
            format="YYYY/MM/DD"
            maskChar="_"
          />
        </div>
      </ThemeProvider>
      <Divider />
      <div className="flex flex-col items-center space-y-4 ">
        <Button
          canClick={!buttonDisabled}
          loading={false}
          actionText="Request To Book"
          onClick={() => setCreateBookingModalVisible(true)}
        />
        <p className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-emerald-600 bg-emerald-200">
          {buttonMessage}
        </p>
      </div>
    </div>
  );
};
