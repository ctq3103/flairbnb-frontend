import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment, { Moment } from "moment";

export const ListingCreateBooking = () => {
  const [value, setValue] = React.useState<Moment | null>(moment());
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#F43F5E",
      },
    },
  });

  return (
    //w-full lg:w-1/3
    <div className="lg:col-span-1 text-center">
      <ThemeProvider theme={theme}>
        <div className="mb-10">
          <KeyboardDatePicker
            label="Check In Date"
            value={value}
            onChange={(date) => setValue(date)}
            minDate={new Date()}
            // shouldDisableDate={() => {
            //   return Math.random() > 0.7;
            // }}
            inputVariant="outlined"
            autoOk
            format="YYYY/MM/DD"
            maskChar="_"
            // maxDate="2021/04/01"
            // maxDateMessage="Test max date"
          />
        </div>
        <KeyboardDatePicker
          label="Check Out Date"
          value={value}
          onChange={(date) => setValue(date)}
          minDate={new Date()}
          // shouldDisableDate={() => {
          //   return Math.random() > 0.7;
          // }}
          inputVariant="outlined"
          autoOk
          format="YYYY/MM/DD"
          maskChar="_"
          // maxDate="2021/04/01"
          // maxDateMessage="Test max date"
        />
      </ThemeProvider>
    </div>
  );
};
