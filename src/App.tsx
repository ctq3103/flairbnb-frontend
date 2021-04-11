import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useQuery, useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Header } from "./lib/components/header";
import { Listings } from "./pages/listings";
import { NotFound } from "./pages/404";
import { Home } from "./pages/home";
import { Listing } from "./pages/listing";
import { EditProfile } from "./pages/user/components/edit-profile";
import { ConfirmEmail } from "./pages/user/confirm-email";
import { Profile } from "./pages/user/profile";
import { CreateAccount } from "./pages/user/create-account";
import { Login } from "./pages/user/login";
import { Stripe } from "./pages/stripe";
import { HostListing } from "./pages/host";
import { USER_QUERY } from "./lib/graphql";
import { User as UserData, UserVariables } from "./__generated__/User";
import { useMe } from "./hooks/useMe";
import { Loading } from "./lib/components/loading";

const commonRoutes = [
  { path: "/confirm", component: <ConfirmEmail /> },
  { path: "/edit-profile", component: <EditProfile /> },
  { path: "/profile/:id", component: <Profile /> },
  { path: "/stripe", component: <Stripe /> },
  { path: "/host", component: <HostListing /> },
];

const logoutRoutes = [
  { path: "/create-account", component: <CreateAccount /> },
  { path: "/login", component: <Login /> },
];

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string,
);

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const { data: meData, loading } = useMe();

  const { loading: userLoading } = useQuery<UserData, UserVariables>(
    USER_QUERY,
    {
      variables: {
        userId: Number(meData?.me.id),
        bookingsPage: 1,
        listingsPage: 1,
        limit: 4,
      },
    },
  );

  if (loading || userLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/listings/:location?">
          <Listings />
        </Route>
        <Route exact path="/listing/:id">
          <Elements stripe={stripePromise}>
            <Listing />
          </Elements>
        </Route>
        {isLoggedIn
          ? commonRoutes.map((route) => (
              <Route key={route.path} path={route.path}>
                {route.component}
              </Route>
            ))
          : logoutRoutes.map((route) => (
              <Route key={route.path} path={route.path}>
                {route.component}
              </Route>
            ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
