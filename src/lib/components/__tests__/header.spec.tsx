import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import { isLoggedInVar } from "../../../apollo";
import { Me } from "../../../graphql/__generated__/Me";
import { Header } from "../header";

describe("<Header />", () => {
  const me: Me = {
    me: {
      __typename: "User",
      id: 1,
      createdAt: "",
      name: "",
      email: "",
      avatar: "",
      emailVerified: true,
      hasWallet: true,
      income: 1000,
    },
  };

  it("should render OK", () => {
    render(
      <MockedProvider>
        <Header me={me} />
      </MockedProvider>,
      { wrapper: MemoryRouter },
    );
  });

  it("should render LoggedIn Parts", async () => {
    const { getByText } = render(
      <MockedProvider>
        <Header me={me} />
      </MockedProvider>,
      { wrapper: MemoryRouter },
    );
    await waitFor(() => {
      isLoggedInVar(true);
    });
    getByText("Host");
  });
});
