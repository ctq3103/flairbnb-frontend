import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../../apollo";
import { Button } from "../reusable/button";
import { FormError } from "../reusable/form-error";
import { LOCALSTORAGE_TOKEN } from "../../constants";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../reusable/toast-message";
import {
  LoginViaEmail as LoginViaEmailData,
  LoginViaEmailVariables,
} from "../../__generated__/LoginViaEmail";

export const LOGIN_VIA_EMAIL = gql`
  mutation LoginViaEmail($input: LoginViaEmailInput!) {
    loginViaEmail(input: $input) {
      ok
      id
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const EmailLogin = () => {
  const history = useHistory();
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    mode: "onChange",
  });

  const onCompleted = (data: LoginViaEmailData) => {
    const {
      loginViaEmail: { ok, id, token },
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
    displayErrorMessage(
      "Unable to login. Please make sure you enter correct email and password",
    );
  };

  const [loginViaEmail, { data: loginResult, loading }] = useMutation<
    LoginViaEmailData,
    LoginViaEmailVariables
  >(LOGIN_VIA_EMAIL, {
    onCompleted,
    onError,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginViaEmail({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className="w-full max-w-screen-sm flex flex-col items-center">
      {/* <img src={logo} className="w-52 mb-10" alt="Instacart" /> */}
      <h4 className="w-full font-medium text-center lg:text-3xl text-xl mb-5">
        Welcome back
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1  mt-5 w-full mb-5 space-y-4"
      >
        <input
          ref={register({
            required: "Email is required",
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          required
          type="email"
          placeholder="Email"
          autoComplete="off"
        />
        {errors.email?.type === "pattern" && (
          <FormError errorMessage={"Please enter a valid email"} />
        )}
        {errors.email?.message && (
          <FormError errorMessage={errors.email?.message} />
        )}
        <input
          ref={register({ required: "Password is required" })}
          required
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="off"
        />
        {errors.password?.message && (
          <FormError errorMessage={errors.password?.message} />
        )}
        <Button
          canClick={formState.isValid}
          loading={loading}
          actionText={"Log in"}
        />
        {loginResult?.loginViaEmail.error && (
          <FormError errorMessage={loginResult.loginViaEmail.error} />
        )}
      </form>
    </div>
  );
};
