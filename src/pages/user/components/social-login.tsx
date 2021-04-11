import { ApolloError, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../../../apollo";
import { LOCALSTORAGE_TOKEN } from "../../../constants";
import { useScrollToTop } from "../../../hooks/useScrollToTop";
import { GoogleAuthUrl as GoogleAuthUrlData } from "../../../__generated__/GoogleAuthUrl";
import {
  LoginViaGoogleVariables,
  LoginViaGoogle as LoginViaGoogleData,
} from "../../../__generated__/LoginViaGoogle";
import { FormError } from "../../../lib/components/form-error";
import { Loading } from "../../../lib/components/loading";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../../../lib/components/toast-message";
import { Divider } from "@material-ui/core";
import {
  ME_QUERY,
  LOGIN_VIA_GOOGLE,
  GOOGLE_AUTH_URL,
} from "../../../lib/graphql";

export const SocialLogin = () => {
  const client = useApolloClient();
  const history = useHistory();

  const onCompleted = (data: LoginViaGoogleData) => {
    const {
      loginViaGoogle: { ok, user, token },
    } = data;
    if (ok && token && user) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      displaySuccessMessage("Login successfully!");

      const queryResult = client.readQuery({
        query: ME_QUERY,
      });
      client.writeQuery({
        query: ME_QUERY,
        data: {
          ...queryResult,
          me: {
            ...user,
            __typename: "User",
          },
        },
      });

      history.push(`/profile/${user.id}`);
    }
  };

  const onError = (e: ApolloError) => {
    displayErrorMessage("Unable to login via Google");
  };

  const [
    loginViaGoogle,
    {
      data: loginViaGoogleData,
      loading: loginViaGoogleLoading,
      error: loginViaGoogleError,
    },
  ] = useMutation<LoginViaGoogleData, LoginViaGoogleVariables>(
    LOGIN_VIA_GOOGLE,
    {
      onCompleted,
      onError,
    },
  );

  useScrollToTop();

  const loginViaGoogleRef = useRef(loginViaGoogle);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      loginViaGoogleRef.current({
        variables: {
          code,
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<GoogleAuthUrlData>({
        query: GOOGLE_AUTH_URL,
      });
      window.location.href = data.googleAuthUrl;
    } catch (err) {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later!",
      );
    }
  };

  if (loginViaGoogleLoading) {
    return <Loading />;
  }

  if (loginViaGoogleData && loginViaGoogleData.loginViaGoogle) {
    return <Redirect to={`/`} />;
  }

  return (
    <>
      <div className="flex items-center w-full my-4 space-x-2 justify-center">
        <Divider className="w-5/12" />
        <div className="text-gray-600 text-sm">or</div>
        <Divider className="w-5/12" />
      </div>
      <div className="flex flex-col w-full">
        <button className="w-full border font-medium text-sm text-gray-700 mb-2 border-gray-500 text-center rounded-md lg:py-5 py-2">
          <i className="fab fa-facebook  text-blue-800 mr-2"></i>
          <span>Continue with Facebook</span>
        </button>
        <button
          className="w-full border font-medium text-sm text-gray-700 mb-2 border-gray-500 text-center rounded-md lg:py-5 py-2"
          onClick={handleAuthorize}
        >
          {loginViaGoogleLoading ? (
            <span className="w-full text-white my-0 mx-auto block relative text-center">
              <i className="fas fa-circle-notch fa-spin fa-lg"></i>
            </span>
          ) : (
            <>
              <i className="fab fa-google text-red-600 mr-2"></i>
              <span>Continue with Google</span>{" "}
            </>
          )}
        </button>
        {loginViaGoogleError && (
          <FormError errorMessage="Sorry! We weren't able to log you in at the moment. Please try again later!" />
        )}
      </div>
    </>
  );
};
