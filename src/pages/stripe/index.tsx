import { useMutation } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { Redirect, useHistory } from "react-router";
import { Loading } from "../../lib/components/loading";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../../lib/components/toast-message";
import { useMe } from "../../hooks/useMe";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import {
  ConnectStripe as ConnectStripeData,
  ConnectStripeVariables,
} from "../../graphql/__generated__/ConnectStripe";
import { CONNECT_STRIPE } from "../../graphql";

export const Stripe = () => {
  const { data: userData } = useMe();
  const history = useHistory();

  const [connectStripe, { data, loading, error }] = useMutation<
    ConnectStripeData,
    ConnectStripeVariables
  >(CONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data && data.connectStripe.ok) {
        displaySuccessMessage(
          "You've successfully connected your Stripe Account! You can now begin to share your rooms!",
        );
      } else if (data.connectStripe.error) {
        displayErrorMessage(
          "Something is wrong! Please check your information thoroughly and try again!",
        );
      }
    },
    onError: (e) => {
      displayErrorMessage(
        "Something is wrong! Please connect to Stripe later!",
      );
    },
  });

  useScrollToTop();

  const connectStripeRef = useRef(connectStripe);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      connectStripeRef.current({
        variables: {
          code,
        },
      });
    } else {
      history.replace("/login");
    }
  }, [history]);

  if (data && data.connectStripe) {
    return <Redirect to={`/profile/${userData?.me.id}`} />;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Redirect to={`/profile/${userData?.me.id}?stripe_error=true`} />;
  }

  return null;
};
