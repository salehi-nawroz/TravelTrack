import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Signup.module.css";

function getSignupErrorMessage(error) {
  switch (error?.code) {
    case "weak_password":
      return "Please choose a stronger password (at least 8 characters).";
    case "validation_failed":
    case "email_address_invalid":
      return "Please enter a valid email address.";
    case "over_email_send_rate_limit":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "We couldn't create your account. Please try again.";
  }
}

export default function Signup() {
  const { isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isDuplicateEmailError, setIsDuplicateEmailError] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  useEffect(() => {
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    setError("");
    setIsDuplicateEmailError(false);

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("submitting");
    try {
      const data = await signup(trimmedName, trimmedEmail, password);
      // When email-enumeration protection is active, Supabase doesn't throw
      // for an already-registered email - it returns a fabricated user with
      // no identities instead, so this has to be checked before treating the
      // call as a fresh signup.
      if (data.user && data.user.identities?.length === 0) {
        setStatus("idle");
        setIsDuplicateEmailError(true);
        return;
      }
      // If email confirmation is disabled, signUp returns a session
      // immediately and the isAuthenticated effect above will redirect.
      if (!data.session) setStatus("success");
    } catch (err) {
      if (
        err.code === "user_already_exists" ||
        err.code === "identity_already_exists"
      ) {
        setStatus("idle");
        setIsDuplicateEmailError(true);
        return;
      }
      setStatus("idle");
      setError(getSignupErrorMessage(err));
    }
  }

  if (status === "success") {
    return (
      <main className={styles.signup}>
        <PageNav />
        <div className={styles.form}>
          <h2>Check your email</h2>
          <p>
            If {email.trim()} isn&apos;t already registered, we&apos;ve sent
            a confirmation link to it. Click the link to verify your account,
            then log in.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.signup}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="fullName">Full name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            autoComplete="name"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <span className={styles.hint}>At least 8 characters.</span>
        </div>

        <div className={styles.row}>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </div>

        {isDuplicateEmailError && (
          <p style={{ color: "var(--color-danger)" }}>
            This email is already registered. Please{" "}
            <Link
              to="/login"
              style={{ color: "var(--color-brand--2)", fontWeight: 600 }}
            >
              log in
            </Link>{" "}
            instead.
          </p>
        )}
        {error && <p style={{ color: "var(--color-danger)" }}>{error}</p>}

        <div>
          <Button type="primary" disabled={status === "submitting"}>
            {status === "submitting" ? "Creating account…" : "Sign up"}
          </Button>
        </div>

        <p className={styles.switch}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}
