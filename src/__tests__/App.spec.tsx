import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { ME_QUERY } from "../graphql";
import App from "../App";

describe("<App />", () => {
  it("renders ok", async () => {
    await waitFor(() => {
      render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "",
                    role: "",
                    emailVerified: false,
                  },
                },
              },
            },
          ]}
        >
          <App />
        </MockedProvider>,
      );
    });
  });
});
