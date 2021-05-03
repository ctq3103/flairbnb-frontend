import React from "react";
import { useForm } from "react-hook-form";
import {
  ListingsFilter,
  ListingType,
} from "../../../graphql/__generated__/globalTypes";

interface ListingsPriceFilterProps {
  filter: ListingsFilter;
  setFilter: (filter: ListingsFilter) => void;
}
interface ListingsTypeFilterProps {
  type: ListingType | undefined;
  setType: (type: ListingType | undefined) => void;
}

interface FormProps {
  listingsFilter: string;
}

export const ListingsPriceFilterOptions = ({
  filter,
  setFilter,
}: ListingsPriceFilterProps) => {
  const { register, getValues } = useForm<FormProps>({
    mode: "all",
  });

  return (
    <div className="relative inline-flex">
      <svg
        className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 412 232"
      >
        <path
          d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
          fill="#648299"
          fillRule="nonzero"
        />
      </svg>

      <select
        name="listingsFilter"
        ref={register()}
        value={filter}
        onChange={(e) => {
          const val = getValues("listingsFilter");
          setFilter(val as ListingsFilter);
        }}
        className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
      >
        {Object.keys(ListingsFilter).map((type, index) => (
          <option value={type} key={index}>
            {type.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </div>
  );
};

export const ListingsTypeFilterOptions = ({
  type,
  setType,
}: ListingsTypeFilterProps) => {
  const { register, getValues } = useForm<FormProps>({
    mode: "all",
  });

  return (
    <div className="relative inline-flex">
      <svg
        className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 412 232"
      >
        <path
          d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
          fill="#648299"
          fillRule="nonzero"
        />
      </svg>

      <select
        name="listingType"
        ref={register()}
        value={type}
        onChange={(e) => {
          const val = getValues("listingType");
          if (val === "all") {
            setType(undefined);
          } else {
            setType(val as ListingType);
          }
        }}
        className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
      >
        <option value="all" key="all-type">
          ALL ROOM TYPE
        </option>
        {Object.keys(ListingType).map((type, index) => (
          <option value={type} key={index}>
            {type.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </div>
  );
};
