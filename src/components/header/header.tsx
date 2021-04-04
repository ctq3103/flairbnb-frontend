import React from "react";
import { useReactiveVar } from "@apollo/client";
import { Link } from "react-router-dom";
import { isLoggedInVar } from "../../apollo";
import logo from "../../images/logo.png";
import { useMe } from "../../hooks/useMe";

export const Header = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const { data } = useMe();

  return (
    <>
      <header className="container max-w-full flex items-center justify-between px-6 h-20 border-b border-gray-400 bg-white fixed inset-0 z-10">
        <div className="flex items-center w-1/2">
          <Link to="/" className="mr-6">
            <img src={logo} className="w-40" alt="Flairbnb" />
          </Link>
          <form className="w-9/12">
            <input
              name="city"
              required
              type="text"
              autoComplete="off"
              placeholder="Where should we go?"
              className="border font-medium placeholder-gray-400 px-4 py-3 rounded-xl shadow-sm hover:shadow-md focus:outline-none transition-shadow w-full lg:w-full"
            />
          </form>
        </div>

        <ul className="flex items-center text-sm font-medium h-full">
          {isLoggedIn ? (
            <>
              <li className="nav-link">
                <Link to={`/profile/${data?.me.id}`}>Profile</Link>
              </li>
              <li className="nav-link">
                <Link to="/logout">Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-link">
                <Link to="/login">Login</Link>
              </li>
              <li className="nav-link">
                <Link to="/create-account">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </header>
    </>
  );
};
