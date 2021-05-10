describe("Log In", () => {
  const user = cy;

  it("should see login page", () => {
    user.visit("/login").title().should("eq", "Login | Flairbnb");
  });

  it("can see email / password validation errors", () => {
    user.visit("/login");
    user.findByPlaceholderText(/email/i).type("bad@email");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("bad@email.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("can fill out the form", () => {
    user.visit("/login");
    user.findByPlaceholderText(/email/i).type("carol@gmail.com");
    user.findByPlaceholderText(/password/i).type("12345678");
    user
      .findByText(/log in/i)
      .should("not.have.class", "pointer-events-none")
      .click();
    user.window().its("localStorage.flairbnb-token").should("be.a", "string");
  });
});
