import React, { useEffect, useRef } from "react";
import { Route } from "react-router-dom";
import { EditProfile } from "../pages/user/components/edit-profile";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { Profile } from "../pages/user/profile";

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
