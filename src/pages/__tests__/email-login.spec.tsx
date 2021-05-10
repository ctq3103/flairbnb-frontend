import React from "react";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { HelmetProvider } from "react-helmet-async";
import { EmailLogin } from "../user/components/email-login";
import userEvent from "@testing-library/user-event";
import { LOGIN_VIA_EMAIL } from "../../graphql";

describe("<EmailLogin />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  let errorMessage;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <EmailLogin />
            </ApolloProvider>
          </Router>
        </HelmetProvider>,
      );
    });
  });
  it("display email validation errors", async () => {
    const { getByText, getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    await waitFor(() => {
      userEvent.type(email, "testinvalidemail");
    });
    getByText("Please enter a valid email");
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });

  it("display password required errors", async () => {
    const { debug, getByText, getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByText("Log in");
    await waitFor(() => {
      userEvent.type(email, "test@email.com");
      userEvent.click(submitBtn);
    });

    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it("submits form and calls mutation", async () => {
    const { debug, getByText, getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);

    const formData = {
      email: "real@test.com",
      password: "12345678",
    };
    const submitBtn = getByText("Log in");

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        loginViaEmail: {
          ok: true,
          token: "test_token",
          user: {},
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_VIA_EMAIL, mockedMutationResponse);
    jest.spyOn(Storage.prototype, "setItem");

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      input: {
        email: formData.email,
        password: formData.password,
      },
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/mutation-error/i);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "flairbnb-token",
      "test_token",
    );
  });
});
