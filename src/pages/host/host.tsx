import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../../components/reusable/toast-message";
import { Button } from "../../components/reusable/button";
import { FormError } from "../../components/reusable/form-error";
import { ListingType } from "../../__generated__/globalTypes";
import { useMe } from "../../hooks/useMe";
import { Helmet } from "react-helmet-async";
import { Link, Redirect } from "react-router-dom";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import {
  HostListing as HostListingData,
  HostListingVariables,
} from "../../__generated__/HostListing";
import { Loading } from "../../components/reusable/loading";

const HOST_LISTING = gql`
  mutation HostListing($input: HostListingInput!) {
    hostListing(input: $input) {
      id
      ok
      error
    }
  }
`;

interface HostListingForm {
  title: string;
  description: string;
  address: string;
  country: string;
  city: string;
  state: string;
  zip: number;
  price: number;
  numOfGuests: number;
  listingType: ListingType;
}

interface FileProps {
  preview: string;
  name: string;
}

function getBase64Value(file: File | Blob) {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.onload = function () {
      return resolve(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  });
}

export const HostListing = () => {
  const { data: userData, loading: userLoading } = useMe();

  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<HostListingForm>({
    mode: "onChange",
    defaultValues: {
      listingType: ListingType.ENTIRE_PLACE,
    },
  });

  useScrollToTop();

  const [
    hostListing,
    { data: hostListingResult, loading, error: hostListingError },
  ] = useMutation<HostListingData, HostListingVariables>(HOST_LISTING, {
    onCompleted: () => {
      displaySuccessMessage(
        "Congratulations! You've successfully created your listing!",
      );
    },
    onError: (e) => {
      displayErrorMessage(
        "Sorry! We weren't able to create your listing. Please try again! Make sure you enter valid address, city and country.",
      );
    },
  });

  const [files, setFiles] = useState<FileProps[]>([]);
  const [images, setImages] = useState<string[] | unknown>();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 2000000,
    maxFiles: 5,
    onDrop: async (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
      let imagesBase64 = await Promise.all(
        acceptedFiles.map((file) => {
          return getBase64Value(file);
        }),
      );
      setImages(imagesBase64);
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0].errors[0].code;
      if (error === "file-too-large") {
        displayErrorMessage(
          "You're only able to upload valid image files of under 2MB in size!",
        );
      }
      if (error === "too-many-files") {
        displayErrorMessage("You're only able to upload maximum 5 files!");
      }
      if (error === "file-invalid-type") {
        displayErrorMessage(
          "You're only able to upload valid JPG or PNG files!",
        );
      }
    },
  });

  const imagePreview = files.map((file) => (
    <div
      className="inline-flex rounded border border-gray-200 mb-2 mr-2 w-24 h-24 p-1 box-border "
      key={file.name}
    >
      <div className="flex min-w-0 overflow-hidden">
        <img
          src={file.preview}
          className="block w-auto h-full"
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      //Revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files],
  );

  if (!userLoading && !userData?.me.hasWallet) {
    return (
      <div className="h-screen flex flex-col justify-center lg:mx-44">
        <h2 className="font-semibold text-2xl mb-3">
          You'll have to be signed in and connected with Stripe to host a
          listing!
        </h2>
        <p className="font-medium text-base mb-5">
          We only allows users who've signed in to our application and have
          connected with Stripe to host new listings. Please go to your Profile
          page and connect with Stripe.
        </p>
        <Link
          className="hover:underline text-rose-600"
          to={`/profile/${userData?.me.id}`}
        >
          Go to my page &rarr;
        </Link>
      </div>
    );
  }

  if (loading || userLoading) {
    return <Loading />;
  }

  if (hostListingResult && hostListingResult.hostListing) {
    return <Redirect to={`/listing/${hostListingResult.hostListing.id}`} />;
  }

  const onSubmit = () => {
    if (!loading) {
      const {
        title,
        description,
        address,
        country,
        city,
        state,
        price,
        numOfGuests,
        listingType,
      } = getValues();
      const fullAddress = `${address}, ${city}, ${state}, ${country}`;

      const input = {
        title,
        description,
        address: fullAddress,
        price: price * 100,
        numOfGuests: numOfGuests * 1,
        type: listingType,
        images: images as string[],
      };

      hostListing({
        variables: {
          input,
        },
      });
    }
  };

  return (
    <div className="w-full max-w-screen-md mx-auto py-8 flex flex-col items-center">
      <Helmet>
        <title>Host your listing | Flairbnb</title>
      </Helmet>
      <h4 className="w-full font-medium lg:text-3xl text-xl text-rose-600 mb-2 uppercase">
        Let's get started hosting your place!
      </h4>
      <p className="w-full text-gray-500  mb-8 ">
        In this form, we'll collect some basic and additional information about
        your listing.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-6 gap-6 items-center mt-5 w-full"
      >
        <div className="col-span-6 sm:col-span-3">
          <label htmlFor="listingType">Room Type</label>
          <select
            ref={register({ required: true })}
            required
            name="listingType"
            className="block w-full p-4 border border-gray-400 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-900"
          >
            {Object.keys(ListingType).map((type, index) => (
              <option value={type} key={index}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          {errors.listingType?.message && (
            <FormError errorMessage={errors.listingType?.message} />
          )}
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label htmlFor="numOfGuests">Max # Of Guests</label>
          <input
            ref={register({ required: "Max # Of Guests is required", min: 0 })}
            required
            name="numOfGuests"
            type="number"
            placeholder="1"
            min={1}
            autoComplete="off"
            className="w-full"
          />
          {errors.numOfGuests?.message && (
            <FormError errorMessage={errors.numOfGuests?.message} />
          )}
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label htmlFor="price">Price</label>
          <input
            ref={register({ required: "Price is required", min: 0 })}
            required
            name="price"
            type="number"
            placeholder="120"
            min={0}
            autoComplete="off"
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-2">All prices in $USD/day</p>
          {errors.price?.message && (
            <FormError errorMessage={errors.price?.message} />
          )}
        </div>

        <div className="col-span-6">
          <label htmlFor="title">Title</label>
          <input
            ref={register({ required: "Title is required", min: 10, max: 50 })}
            required
            name="title"
            type="text"
            placeholder="Title"
            autoComplete="off"
            className="w-full"
          />
          {errors.title?.message && (
            <FormError errorMessage={errors.title?.message} />
          )}
        </div>

        <div className="col-span-6 ">
          <label htmlFor="description">Description</label>
          <textarea
            ref={register({
              required: "Description is required",
              min: 10,
              max: 500,
            })}
            required
            name="description"
            placeholder="Description"
            rows={800}
            autoComplete="off"
            className="w-full"
          />
          {errors.description?.message && (
            <FormError errorMessage={errors.description?.message} />
          )}
        </div>

        <div className="col-span-6">
          <label htmlFor="address">Street address</label>
          <input
            ref={register({ required: "Address is required" })}
            className="w-full"
            type="text"
            name="address"
            autoComplete="off"
          />
          {errors.address?.message && (
            <FormError errorMessage={errors.address?.message} />
          )}
        </div>

        <div className="col-span-6">
          <label htmlFor="country">Country</label>
          <input
            ref={register({ required: "Country is required" })}
            required
            className="w-full"
            type="text"
            name="country"
            autoComplete="off"
          />
          {errors.country?.message && (
            <FormError errorMessage={errors.country?.message} />
          )}
        </div>

        <div className="col-span-6 sm:col-span-6 lg:col-span-2">
          <label htmlFor="city">City</label>
          <input
            ref={register({ required: "City is required" })}
            required
            className="w-full"
            type="text"
            name="city"
            autoComplete="off"
          />
          {errors.city?.message && (
            <FormError errorMessage={errors.city?.message} />
          )}
        </div>

        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <label htmlFor="state">State / Province</label>
          <input
            ref={register({ required: "State/Province is required" })}
            required
            className="w-full"
            type="text"
            name="state"
            autoComplete="off"
          />
          {errors.state?.message && (
            <FormError errorMessage={errors.state?.message} />
          )}
        </div>

        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <label htmlFor="zip">ZIP / Postal</label>
          <input
            ref={register()}
            className="w-full"
            type="number"
            name="zip"
            autoComplete="off"
          />
          {errors.zip?.message && (
            <FormError errorMessage={errors.zip?.message} />
          )}
        </div>

        <div className="col-span-6">
          <label>Room photos</label>
          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-200"
            {...getRootProps()}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600 items-center">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer bg-white rounded-md text-indigo-600 hover:text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload files or drag and drop</span>
                  <input
                    name="images"
                    type="file"
                    className="sr-only"
                    {...getInputProps()}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                JPEG, PNG, JPG up to 2MB. Maximum 5 files.
              </p>
            </div>
          </div>
          <aside className="flex flex-wrap mt-4">{imagePreview}</aside>
        </div>

        <Button
          canClick={formState.isValid}
          loading={loading}
          actionText={"Submit"}
          styling="col-start-3 col-end-5"
        />
        {hostListingResult?.hostListing.error && (
          <FormError errorMessage={hostListingResult.hostListing.error} />
        )}
      </form>
    </div>
  );
};
