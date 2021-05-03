import React, { useEffect, useState } from "react";
import { useApolloClient, useReactiveVar } from "@apollo/client";
import { Link, useHistory, useLocation } from "react-router-dom";
import { isLoggedInVar } from "../../apollo";
import { displayErrorMessage } from "./toast-message";
import { Tooltip } from "@material-ui/core";
import { LOCALSTORAGE_TOKEN } from "../../constants";
import { authTokenVar } from "../../apollo";
import { Me } from "../../graphql/__generated__/Me";

interface Props {
  me: Me | undefined;
}

export const Header = ({ me }: Props) => {
  const client = useApolloClient();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [search, setSearch] = useState("");

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    const pathnameSubStrings = pathname.split("/");

    if (!pathname.includes("/listings")) {
      setSearch("");
      return;
    }

    if (pathname.includes("/listings") && pathnameSubStrings.length === 3) {
      setSearch(pathnameSubStrings[2]);
      return;
    }
    return () => {};
  }, [location]);

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please enter a valid search!");
    }
  };

  return (
    <nav className=" bg-white w-full flex justify-between items-center mx-auto container max-w-full px-6 h-20 shadow-sm fixed inset-0 z-10">
      <div className="flex h-full items-center">
        <Link to="/" className="">
          <span
            className="text-rose-500 text-xl md:text-4xl font-medium"
            style={{ fontFamily: "Quicksand" }}
          >
            flairbnb
          </span>
        </Link>
      </div>

      <div className="hidden sm:block flex-shrink flex-grow-0 justify-start px-2 ">
        <div className="inline-block ">
          <div className="inline-flex items-center flex-grow-0 flex-shrink pl-2 relative border rounded-full px-4 py-2 w-80">
            <input
              type="text"
              autoComplete="off"
              className="block flex-grow flex-shrink overflow-hidden border-transparent p-0 pl-2  focus:outline-none focus:border-transparent text-gray-700"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex items-center justify-center relative h-8 w-8 rounded-full">
              <button
                onClick={(e) => onSearch(search)}
                className="bg-rose-500 p-3 ml-3 rounded-full hover:bg-rose-600"
              >
                <svg
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    fill: "none",
                    height: "14px",
                    width: "14x",
                    stroke: "currentcolor",
                    strokeWidth: " 5.33333",
                    overflow: "visible",
                    color: "#ffffff",
                  }}
                >
                  <g fill="none">
                    <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-initial">
        <div className="flex justify-end items-center relative space-x-2">
          {isLoggedIn ? (
            <>
              <div className="flex items-center">
                <Link
                  to="/host"
                  className="inline-block py-2 px-3 hover:bg-gray-200 rounded-full"
                >
                  <div className="flex items-center relative cursor-pointer whitespace-nowrap space-x-2">
                    <i className="fas fa-home fa-lg text-gray-500"></i>
                    <span>Host</span>
                  </div>
                </Link>
              </div>

              <div className="flex items-center">
                <Tooltip title="Chat">
                  <Link
                    to={`/chat`}
                    className="inline-block py-2 px-3 hover:bg-gray-200 rounded-full"
                  >
                    <div className="flex items-center relative cursor-pointer whitespace-nowrap space-x-2">
                      <i className="far fa-comments fa-lg text-gray-500"></i>
                    </div>
                  </Link>
                </Tooltip>
              </div>

              <div className="flex items-center">
                <Tooltip title="Profile">
                  <Link
                    to={`/profile/${me?.me.id}`}
                    className="inline-block py-2 px-3 hover:bg-gray-200 rounded-full"
                  >
                    <div className="flex items-center relative cursor-pointer whitespace-nowrap space-x-2">
                      <i className="fas fa-user-circle fa-lg text-gray-500"></i>
                    </div>
                  </Link>
                </Tooltip>
              </div>

              <div className="flex items-center">
                <Tooltip title="Sign Out">
                  <button
                    className="inline-block py-2 px-3 hover:bg-gray-200 rounded-full"
                    onClick={() => {
                      localStorage.setItem(LOCALSTORAGE_TOKEN, "");
                      authTokenVar(null);
                      isLoggedInVar(false);
                      client.cache.reset();
                      history.push("/");
                    }}
                  >
                    <div className="flex items-center relative cursor-pointer whitespace-nowrap space-x-2">
                      <i className="fas fa-sign-out-alt fa-lg text-gray-500"></i>
                    </div>
                  </button>
                </Tooltip>
              </div>
            </>
          ) : (
            <Tooltip title="Sign In">
              <Link to="/login">
                <i className="fas fa-sign-in-alt fa-lg text-gray-500"></i>
              </Link>
            </Tooltip>
          )}
        </div>
      </div>
    </nav>
  );
};
