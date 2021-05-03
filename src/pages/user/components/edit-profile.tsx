import { ApolloError, gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Button } from "../../../lib/components/button";
import { useMe } from "../../../hooks/useMe";
import {
  EditProfile as EditProfileData,
  EditProfileVariables,
} from "../../../graphql/__generated__/EditProfile";
import { FormError } from "../../../lib/components/form-error";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../../../lib/components/toast-message";
import { Helmet } from "react-helmet-async";
import { EDIT_PROFILE_MUTATION } from "../../../graphql";

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

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 2000000,
    maxFiles: 5,
  });

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
          <div>
            <div
              className="my-2 flex justify-center align-middle h-24 w-24 border-2 border-gray-500 border-dashed rounded-full hover:border-gray-300 group "
              {...getRootProps()}
            >
              <i className="fas fa-plus mx-auto my-auto text-gray-500 group-hover:text-gray-300 3x"></i>
              <input
                name="images"
                type="file"
                className="sr-only"
                {...getInputProps()}
              />
            </div>
            {/* <aside className="flex flex-wrap mt-4"></aside> */}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo
            </label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <svg
                  className="h-full w-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <input
                type="file"
                accept="image/*"
                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              />
              
            </div>
          </div> */}

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
