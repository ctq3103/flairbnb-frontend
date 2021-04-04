import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Header } from "./components/header/header";
import { Listings } from "./pages/listings/listings";
import { NotFound } from "./pages/404";
import { Home } from "./pages/home/home";
import { Listing } from "./pages/listing/listing";
import { EditProfile } from "./components/user/edit-profile";
import { ConfirmEmail } from "./pages/user/confirm-email";
import { Profile } from "./pages/user/profile";
import { CreateAccount } from "./pages/user/create-account";
import { Login } from "./pages/user/login";
import { Stripe } from "./pages/stripe/stripe";
import { HostListing } from "./pages/host/host";

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

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/listings">
          <Elements stripe={stripePromise}>
            <Listings />
          </Elements>
        </Route>
        <Route exact path="/listing/:id">
          <Listing />
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
