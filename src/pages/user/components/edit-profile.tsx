import { ApolloError, gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
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
import axios from "axios";
import { Loading } from "../../../lib/components/loading";

interface IFormProps {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();

  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);

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
          ...(name !== userData?.me.name && { name }),
          ...(email !== userData?.me.email && { email }),
          ...(avatar !== "" && { avatar }),
          ...(password !== "" && { password }),
        },
      },
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 1000000,
    maxFiles: 1,
    onDrop: async (files) => {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("folder", "flairbnb-avatars");
      formData.append(
        "api_key",
        process.env.REACT_APP_CLOUDINARY_API_KEY as string,
      );
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET as string,
      );
      formData.append("timestamp", String(Date.now() / 1000));
      const {
        data: { secure_url },
      } = await axios.post(
        "https://api.cloudinary.com/v1_1/quynhhchu/image/upload",
        formData,
      );
      if (secure_url) {
        setAvatar(secure_url);
      }
      setUploading(false);
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0].errors[0].code;
      if (error === "file-too-large") {
        displayErrorMessage(
          "You're only able to upload valid image file of under 1MB in size!",
        );
      }
      if (error === "too-many-files") {
        displayErrorMessage("You're only able to upload 01 image only!");
      }
      if (error === "file-invalid-type") {
        displayErrorMessage(
          "You're only able to upload valid JPG or PNG files!",
        );
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Edit Profile | Flairbnb</title>
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
            <div className="flex justify-start items-center space-x-8">
              <div
                className="my-2 flex justify-center align-middle h-24 w-24 border-2 border-gray-500 border-dashed rounded-full hover:border-gray-300 group "
                {...getRootProps()}
              >
                {uploading ? (
                  <Loading />
                ) : (
                  <i className="fas fa-plus mx-auto my-auto text-gray-500 group-hover:text-gray-300 3x"></i>
                )}
                <input
                  name="image"
                  type="file"
                  className="sr-only"
                  {...getInputProps()}
                />
              </div>
              {avatar && (
                <img
                  className="h-24 w-24 rounded-full"
                  src={avatar}
                  alt="user-avatar"
                />
              )}
            </div>
            <small>*JPEG, PNG, JPG up to 1MB and 01 file only.</small>
          </div>

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
