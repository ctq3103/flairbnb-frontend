import React from "react";
import { render, waitFor } from "../../test-utils";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { CreateAccountForm } from "../user/components/create-account-form";
import { RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CREATE_ACCOUNT_MUTATION } from "../../graphql";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe("<CreateAccountForm />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccountForm />
        </ApolloProvider>,
      );
    });
  });

  it("renders validation errors", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const name = getByPlaceholderText(/name/i);
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText("Password");
    const confirmPassword = getByPlaceholderText("Confirm password");

    await waitFor(() => {
      userEvent.type(name, "name");
      userEvent.clear(name);
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("Name is required");

    await waitFor(() => {
      userEvent.type(name, "name");
      userEvent.type(email, "wrongemail");
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);

    await waitFor(() => {
      userEvent.type(name, "name");
      userEvent.type(email, "email@mail.com");
      userEvent.clear(email);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);

    await waitFor(() => {
      userEvent.type(name, "name");
      userEvent.type(email, "email@mail.com");
      userEvent.type(password, "12345678");
      userEvent.clear(password);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password is required/i);

    await waitFor(() => {
      userEvent.type(name, "name");
      userEvent.clear(email);
      userEvent.type(email, "email@mail.com");
      userEvent.type(password, "12345678");
      userEvent.type(confirmPassword, "12348");
      userEvent.clear(confirmPassword);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Passwords do not match/i);
  });

  it("submits mutation with form values", async () => {
    const { getByText, getByRole, getByPlaceholderText } = renderResult;
    const name = getByPlaceholderText(/name/i);
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText("Password");
    const confirmPassword = getByPlaceholderText("Confirm password");
    const button = getByText("Create Account");
    const formData = {
      name: "Username",
      email: "working@mail.com",
      password: "12345678",
      confirmPassword: "12345678",
    };
    const mockedCreateAccountMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedCreateAccountMutationResponse,
    );
    await waitFor(() => {
      userEvent.type(name, formData.name);
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.type(confirmPassword, formData.confirmPassword);
      userEvent.click(button);
    });
    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledWith({
      input: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
    });

    const mutationError = getByRole("alert");
    expect(mockPush).toHaveBeenCalledWith("/login");
    expect(mutationError).toHaveTextContent("mutation-error");
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
