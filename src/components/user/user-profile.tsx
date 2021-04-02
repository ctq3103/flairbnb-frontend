import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { DisconnectStripe } from "../../__generated__/DisconnectStripe";
import { User } from "../../__generated__/User";
import { ImageAvatar, LetterAvatar } from "../reusable/avatar";
import { Divider } from "../reusable/divider";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../reusable/toast-message";
import { VerifiedCheck } from "../reusable/verified-check";

const DISCONNECT_STRIPE = gql`
  mutation DisconnectStripe {
    disconnectStripe {
      ok
      error
    }
  }
`;

interface Props {
  user: User["userProfile"]["user"];
  isMyProfile: boolean;
  handleUserRefetch: () => Promise<void>;
}

export const UserProfile = ({
  user,
  isMyProfile,
  handleUserRefetch,
}: Props) => {
  //const letterAvatar = user.email.charAt(0).toUpperCase();
  const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`;

  const [disconnectStripe, { loading, error }] = useMutation<DisconnectStripe>(
    DISCONNECT_STRIPE,
    {
      onCompleted: (data) => {
        displaySuccessMessage(
          "You've successfully disconnected from Stripe! You'll have to reconnect with Stripe to continue to create listings.",
        );
        handleUserRefetch();
      },
      onError: () => {
        displayErrorMessage(
          "Sorry! We weren't able to disconnect you from Stripe. Please try again later!",
        );
      },
    },
  );

  console.log("disconnec error", error);

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

  const walletDetails =
    isMyProfile && user?.hasWallet ? (
      <div className="first:ml-0 w-full space-y-3">
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
          prevent users from booking listings that you might have already
          created.
        </p>
      </div>
    ) : (
      <div className="w-full space-y-3">
        <p className="">
          Interested in becoming a Flairbnb host? <br />
          Register with your Stripe account!
        </p>
        <button
          className="text-sm btn-secondary my-3"
          onClick={redirectToStripe}
        >
          Connect With Stripe
        </button>
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
          <i className="far fa-edit p-3 text-gray-700"></i>
        </Link>
      )}
      {avatarSection}
      <div className="flex items-center">
        <span className="text-lg font-medium mt-1">{user?.name}</span>
        {user?.emailVerified && <VerifiedCheck />}
      </div>
      <Divider className="w-8/12 my-6" />
      <div className="w-full space-y-3">
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
      <Divider className="w-8/12 my-4" />
      {walletDetails}
    </div>
  );
};
