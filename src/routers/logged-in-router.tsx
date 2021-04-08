import React, { useEffect, useRef } from "react";
import { Route } from "react-router-dom";
import { EditProfile } from "../pages/user/components/edit-profile";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { Profile } from "../pages/user/profile";

// const ClientRouter = [
//     <Route exact key={1} path="/confirm">
//       <ConfirmEmail />
//     </Route>
//     <Route exact key={2} path="/profile/:id">
//       <Profile />
//     </Route>
//     <Route exact key={3} path="/edit-profile">
//       <EditProfile />
//     </Route>
//   ]

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return <div></div>;
};
