import { render } from "@testing-library/react";
import React from "react";
import { Button } from "../button";

describe("<Button />", () => {
  it("should render OK with props", () => {
    render(<Button canClick={true} loading={false} actionText="Test Button" />);
  });
});
