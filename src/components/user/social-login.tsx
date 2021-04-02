import { ApolloError, gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../../apollo";
import { LOCALSTORAGE_TOKEN } from "../../constants";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { GoogleAuthUrl as GoogleAuthUrlData } from "../../__generated__/GoogleAuthUrl";
import {
  LoginViaGoogleVariables,
  LoginViaGoogle as LoginViaGoogleData,
} from "../../__generated__/LoginViaGoogle";
import { Divider } from "../reusable/divider";
import { ErrorBanner } from "../reusable/error-banner";
import { FormError } from "../reusable/form-error";
import { Loading } from "../reusable/loading";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../reusable/toast-message";

const LOGIN_VIA_GOOGLE = gql`
  mutation LoginViaGoogle($code: String!) {
    loginViaGoogle(input: { code: $code }) {
      ok
      id
      error
      token
    }
  }
`;

const GOOGLE_AUTH_URL = gql`
  query GoogleAuthUrl {
    googleAuthUrl
  }
`;

export const SocialLogin = () => {
  const client = useApolloClient();
  const history = useHistory();

  const onCompleted = (data: LoginViaGoogleData) => {
    const {
      loginViaGoogle: { ok, id, token },
    } = data;
    if (ok && token && id) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      displaySuccessMessage("Login successfully!");
      history.push(`/profile/${id}`);
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
      console.log(data);
    } catch (err) {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later!",
      );
    }
  };

  if (loginViaGoogleLoading) {
    return <Loading message="Logging you in..." />;
  }

  if (loginViaGoogleData && loginViaGoogleData.loginViaGoogle) {
    // const { id: viewerId } = loginViaGoogleData.loginViaGoogle.
    return <Redirect to={`/`} />;
  }

  // if (loginViaGoogleError) {
  //   return displayErrorMessage(
  //     "Sorry! We weren't able to log you in. Please try again later!",
  //   );
  // }

  return (
    <>
      <div className="flex items-center w-full my-4">
        <Divider />
        <div className="text-gray-600 text-sm mx-4">or</div>
        <Divider />
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
          <i className="fab fa-google text-red-600 mr-2"></i>
          <span>Continue with Google</span>
        </button>
        {loginViaGoogleError && (
          <FormError errorMessage="Sorry! We weren't able to log you in at the moment. Please try again later!" />
        )}
      </div>
    </>
  );
};
