describe("Create Account", () => {
  const user = cy;
  it("should see validation errors", () => {
    user.visit("/create-account");

    user
      .findByPlaceholderText(/fullname/i)
      .type("name")
      .clear();
    user.findByRole("alert").should("have.text", "Name is required");
    user.findByPlaceholderText(/name/i).type("Real name");

    user.findByPlaceholderText(/email/i).type("non@good");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("real@mail.com");

    user.findByPlaceholderText("Password").type("12").clear();
    user.findByRole("alert").should("have.text", "Password is required");
    user.findByPlaceholderText("Password").type("12");
    user
      .findByRole("alert")
      .should("have.text", "Password must be at least 8 characters");
    user.findByPlaceholderText("Password").type("12345678");

    user.findByPlaceholderText("Confirm password").type("12");
    user.findByRole("alert").should("have.text", "Passwords do not match");
    user.findByPlaceholderText("Confirm password").type("12").clear();
    user
      .findByRole("alert")
      .should("have.text", "Password confirmation is required");

    user.findByPlaceholderText("Confirm password").type("12345678");
  });

  it("should be able to create account and login", () => {
    user.intercept("http://localhost:5000/graphql", (req) => {
      const { operationName } = req.body;
      console.log(req.body);
      if (operationName && operationName === "CreateAccount") {
        req.reply((res) => {
          res.send({
            fixture: "create-account.json",
          });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/name/i).type("Gal Gadot");
    user.findByPlaceholderText(/email/i).type("gal@mail.com");
    user.findByPlaceholderText("Password").type("12345678");
    user.findByPlaceholderText("Confirm password").type("12345678");
    user.findByText("Create Account").click();
    user.wait(5000);
    // @ts-ignore
    user.login("gal@mail.com", "12345678");
  });
});
