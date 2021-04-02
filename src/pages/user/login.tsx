import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { EmailLogin } from "../../components/user/email-login";
import { SocialLogin } from "../../components/user/social-login";

export const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login | Flairbnb</title>
      </Helmet>
      <div className="form-container">
        <EmailLogin />
        <SocialLogin />
        <div className="text-gray-500 mt-4 w-full">
          Don’t have an account?{" "}
          <Link
            to="/create-account"
            className="text-gray-800 font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
};
