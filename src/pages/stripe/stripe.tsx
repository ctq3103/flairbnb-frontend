import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { Redirect, useHistory } from "react-router";
import { Loading } from "../../components/reusable/loading";
import { displaySuccessMessage } from "../../components/reusable/toast-message";
import { useMe } from "../../hooks/useMe";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import {
  ConnectStripe as ConnectStripeData,
  ConnectStripeVariables,
} from "../../__generated__/ConnectStripe";

const CONNECT_STRIPE = gql`
  mutation ConnectStripe($code: String!) {
    connectStripe(input: { code: $code }) {
      ok
      error
    }
  }
`;

export const Stripe = () => {
  const { data: userData } = useMe();
  const history = useHistory();

  const [connectStripe, { data, loading, error }] = useMutation<
    ConnectStripeData,
    ConnectStripeVariables
  >(CONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data && data.connectStripe) {
        displaySuccessMessage(
          "You've successfully connected your Stripe Account! You can now begin to share your rooms!",
        );
      }
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
    return <Loading message="Connecting your Stripe account..." />;
  }

  if (error) {
    return <Redirect to={`/profile/${userData?.me.id}?stripe_error=true`} />;
  }

  return null;
};
