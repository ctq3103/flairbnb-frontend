import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
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
import { useMe } from "./hooks/useMe";
import { Loading } from "./lib/components/loading";
import { Chat } from "./pages/chat";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string,
);

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const { data: meData, loading } = useMe();

  if (loading) {
    return <Loading />;
  }

  const commonRoutes = [
    { path: "/confirm", component: <ConfirmEmail /> },
    { path: "/edit-profile", component: <EditProfile /> },
    { path: "/profile/:id", component: <Profile me={meData} /> },
    { path: "/chat", component: <Chat me={meData} /> },
    { path: "/stripe", component: <Stripe /> },
    { path: "/host", component: <HostListing /> },
  ];

  const logoutRoutes = [
    { path: "/create-account", component: <CreateAccount /> },
    { path: "/login", component: <Login /> },
  ];

  return (
    <Router>
      <Header me={meData} />
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
