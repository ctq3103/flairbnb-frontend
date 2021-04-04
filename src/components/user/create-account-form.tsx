import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button } from "../reusable/button";
import { FormError } from "../reusable/form-error";
import {
  CreateAccount as CreateAccountData,
  CreateAccountVariables,
} from "../../__generated__/CreateAccount";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../reusable/toast-message";

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const CreateAccountForm = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
  });
  const history = useHistory();

  const [createAccount, { loading, data: createAccountResult }] = useMutation<
    CreateAccountData,
    CreateAccountVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted: (data: CreateAccountData) => {
      const { ok } = data?.createAccount;

      if (ok) {
        displaySuccessMessage("Create account successfully! Please log in now");
        history.push("/login");
      }
    },
    onError: (error: ApolloError) => {
      displayErrorMessage("Could not create account. Please try again");
    },
  });

  const onSubmit = () => {
    if (!loading) {
      const { name, email, password } = getValues();
      createAccount({
        variables: {
          input: { name, email, password },
        },
      });
    }
  };

  return (
    <div className="w-full max-w-screen-sm flex flex-col items-center">
      {/* <img src={logo} className="w-52 mb-10" alt="Flairbnb" /> */}
      <h4 className="w-full font-medium text-center lg:text-3xl text-xl mb-5">
        Let's get started
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 mt-5 w-full mb-5 space-y-4"
      >
        <input
          ref={register({ required: "Name is required" })}
          name="name"
          type="text"
          placeholder="Fullname"
          autoComplete="off"
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name?.message} />
        )}
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
        {errors.email?.message && (
          <FormError errorMessage={errors.email?.message} />
        )}
        {errors.email?.type === "pattern" && (
          <FormError errorMessage={"Please enter a valid email"} />
        )}
        <input
          ref={register({ required: "Password is required" })}
          required
          name="password"
          type="password"
          placeholder="Password"
          minLength={8}
          autoComplete="off"
        />
        {errors.password?.message && (
          <FormError errorMessage={errors.password?.message} />
        )}
        <input
          ref={register({
            required: "Password confirmation is required",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
          required
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          minLength={8}
          autoComplete="off"
        />
        {errors.confirmPassword?.message && (
          <FormError errorMessage={errors.confirmPassword?.message} />
        )}
        {/* <select
            name="role"
            ref={register({ required: true })}
            className="input"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select> */}
        <Button
          canClick={formState.isValid}
          loading={loading}
          actionText={"Create Account"}
        />
        {createAccountResult?.createAccount.error && (
          <FormError errorMessage={createAccountResult.createAccount.error} />
        )}
      </form>
    </div>
  );
};
