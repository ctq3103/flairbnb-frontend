import { ApolloError, gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../reusable/button";
import { useMe } from "../../hooks/useMe";
import {
  EditProfile as EditProfileData,
  EditProfileVariables,
} from "../../__generated__/EditProfile";
import { FormError } from "../reusable/form-error";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../reusable/toast-message";
import { Helmet } from "react-helmet-async";

const EDIT_PROFILE_MUTATION = gql`
  mutation EditProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();

  const onCompleted = (data: EditProfileData) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              emailVerified
              email
            }
          `,
          data: {
            email: newEmail,
            emailVerified: false,
          },
        });
      }
      displaySuccessMessage("Edit profile successfully!");
    }
  };

  const onError = (error: ApolloError) => {
    displayErrorMessage("Something went wrong. Please try again");
  };

  const [editProfile, { loading }] = useMutation<
    EditProfileData,
    EditProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
    onError,
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState,
    errors,
  } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      name: userData?.me.name,
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { name, email, password } = getValues();
    editProfile({
      variables: {
        input: {
          name,
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <>
      <Helmet>
        <title>Create Account | Flairbnb</title>
      </Helmet>
      <div className="form-container">
        <h4 className="w-full font-medium text-center lg:text-3xl text-xl mb-5">
          Edit Profile
        </h4>
        {!userData?.me.emailVerified && (
          <div className="text-left text-red-500 w-full">
            <span>* Please check your email to verify your account</span>
          </div>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
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
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            //className="input"
            type="email"
            placeholder="Email"
          />
          <input
            ref={register}
            name="password"
            type="password"
            minLength={8}
            placeholder="Password"
            autoComplete="off"
          />
          <input
            ref={register({
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            minLength={8}
            autoComplete="off"
          />
          {errors.confirmPassword?.message && (
            <FormError errorMessage={errors.confirmPassword?.message} />
          )}
          {/* <select name="role" ref={register({ required: true })}>
            <option>hihi</option>
          </select> */}
          <Button
            loading={loading}
            canClick={formState.isValid}
            actionText="Save Profile"
          />
        </form>
      </div>
    </>
  );
};
