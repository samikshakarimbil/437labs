import React from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";

interface ILoginPageProps {
  isRegistering: boolean;
  addToken: (token: string) => void;
}

export function LoginPage(props: ILoginPageProps) {
  const usernameInputId = React.useId();
  const passwordInputId = React.useId();
  const navigate = useNavigate();

  const [result, submitAction, isPending] = React.useActionState(
    async (_prev: { status: number; message: string }, formData: FormData) => {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      const endpoint = props.isRegistering ? "/auth/register" : "/auth/login";

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const token = await response.text();

        if (!response.ok) {
          return { status: response.status, message: token };
        }

        // Pass token to parent component and redirect
        props.addToken(token);
        navigate("/");

        return { status: response.status, message: "Success" };
      } catch (e) {
        return { status: 500, message: "Server error. Please try again." };
      }
    },
    { status: -1, message: "" }
  );

  return (
    <>
      <h2>{props.isRegistering ? "Register a new account" : "Login"}</h2>
      <form className="LoginPage-form" action={submitAction}>
        <label htmlFor={usernameInputId}>Username</label>
        <input
          id={usernameInputId}
          name="username"
          required
          disabled={isPending}
        />

        <label htmlFor={passwordInputId}>Password</label>
        <input
          id={passwordInputId}
          name="password"
          type="password"
          required
          disabled={isPending}
        />

        <input type="submit" value="Submit" disabled={isPending} />

        {result.status >= 400 && (
          <p style={{ color: "red" }} aria-live="polite">
            {result.message}
          </p>
        )}
      </form>

      {!props.isRegistering && (
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      )}
    </>
  );
}
