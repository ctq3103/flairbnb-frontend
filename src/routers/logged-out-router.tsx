import React from "react";
import { Route } from "react-router-dom";
import { CreateAccount } from "../pages/user/create-account";
import { Login } from "../pages/user/login";

export const LoggedOutRouter = () => {
  return (
    <>
      <Route exact path="/create-account">
        <CreateAccount />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
    </>
  );
};
