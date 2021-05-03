import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../../lib/utils/formatPrice";
import { DisconnectStripe } from "../../../graphql/__generated__/DisconnectStripe";
import { User } from "../../../graphql/__generated__/User";
import { ImageAvatar, LetterAvatar } from "../../../lib/components/avatar";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../../../lib/components/toast-message";
import { VerifiedCheck } from "../../../lib/components/verified-check";
import { Divider, Tooltip } from "@material-ui/core";
import { DISCONNECT_STRIPE } from "../../../graphql";

interface Props {
  user: User["userProfile"]["user"];
  isMyProfile: boolean;
}

export const UserProfile = ({ user, isMyProfile }: Props) => {
  const client = useApolloClient();

  const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`;

  const [disconnectStripe, { loading }] = useMutation<DisconnectStripe>(
    DISCONNECT_STRIPE,
    {
      onCompleted: (data) => {
        displaySuccessMessage(
          "You've successfully disconnected from Stripe! You'll have to reconnect with Stripe to continue to create listings.",
        );

        client.writeFragment({
          id: `User:${user.id}`,
          fragment: gql`
            fragment VerifiedUser on User {
              hasWallet
            }
          `,
          data: {
            hasWallet: false,
          },
        });
      },
      onError: () => {
        displayErrorMessage(
          "Sorry! We weren't able to disconnect you from Stripe. Please try again later!",
        );
      },
    },
  );

  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  };

  const avatarSection = user?.avatar ? (
    <ImageAvatar size="large" imageUrl={user.avatar} />
  ) : (
    <LetterAvatar
      size="large"
      letter={user?.name.charAt(0).toUpperCase() as string}
    />
  );

  const walletDetails = user?.hasWallet ? (
    <div className="first:ml-0 w-full space-y-3 mt-4">
      <span className="text-xs font-semibold inline-block py-1 px-2  rounded-full text-indigo-600 bg-indigo-200 uppercase last:mr-0 mr-1">
        Stripe Connected
      </span>
      <p>
        Income Earned:{" "}
        <span className="font-medium">
          {user.income ? formatPrice(user.income) : "$0"}
        </span>
      </p>
      <button
        className="btn-outline"
        type="button"
        onClick={() => disconnectStripe()}
      >
        {loading ? "Loading..." : "Disconnect Stripe"}
      </button>
      <p className="text-xs text-gray-400">
        By disconnecting, you won't be able to receive{" "}
        <span className="font-medium">any further payments</span>. This will
        prevent users from booking listings that you might have already created.
      </p>
    </div>
  ) : (
    <div className="w-full space-y-3 mt-4">
      <p className="">
        Interested in becoming a Flairbnb host? <br />
        Register with your Stripe account!
      </p>
      <button
        className={`text-sm my-3 ${
          user.emailVerified ? "btn-secondary" : "btn-disabled"
        }`}
        disabled={!user.emailVerified}
        onClick={redirectToStripe}
      >
        Connect With Stripe
      </button>
      {!user.emailVerified && (
        <p className="text-xs text-rose-400">
          Please verify your account before connecting with Stripe
        </p>
      )}
      <p className="text-xs text-gray-400">
        Flairbnb uses{" "}
        <a
          href="https://stripe.com/en-US/connect"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-700"
        >
          Stripe Connect
        </a>{" "}
        to help transfer your earnings in a secure and trusted manner.
      </p>
    </div>
  );

  return (
    <div className="container lg:w-1/3 md:w-1/2 mx-auto my-10 flex flex-col items-center border p-6 border-gray-400 relative">
      {isMyProfile && (
        <Link
          to="/edit-profile"
          className="absolute top-0 right-0 transition-colors hover:bg-gray-100 rounded-full"
        >
          <Tooltip title="Edit Profile">
            <i className="far fa-edit p-3 text-gray-700"></i>
          </Tooltip>
        </Link>
      )}
      {avatarSection}
      <div className="flex items-center mb-4">
        <span className="text-lg font-medium mt-1">{user?.name}</span>
        {user?.emailVerified && <VerifiedCheck />}
      </div>
      <Divider className="w-full" />
      <div className="w-full space-y-3 my-4">
        {user?.email && (
          <p>
            Email: <span className="font-medium">{user.email}</span>
          </p>
        )}
        {user?.createdAt && (
          <p>
            Joined at:{" "}
            <span className="font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </p>
        )}
      </div>
      {isMyProfile && (
        <>
          <Divider className="w-full" />
          {walletDetails}
        </>
      )}
    </div>
  );
};
