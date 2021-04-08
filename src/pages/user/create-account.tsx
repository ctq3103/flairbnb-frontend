import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CreateAccountForm } from "./components/create-account-form";
import { SocialLogin } from "./components/social-login";

export const CreateAccount = () => {
  return (
    <>
      <Helmet>
        <title>Create Account | Flairbnb</title>
      </Helmet>
      <div className="form-container">
        <CreateAccountForm />
        <SocialLogin />
        <div className="text-gray-500 mt-4 w-full">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gray-800 font-medium hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
};
