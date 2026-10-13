import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Navigation } from "lucide-react";

import { read, write } from "../services/storageService";

import type { User } from "../types";
import { Intro } from "../components/Common";
import { useSydney } from "../state";
export function Auth({ signup = false }: { signup?: boolean }) {
  const { nav, setUser, plan } = useSydney();
  const [error, setError] = useState("");
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const email = String(d.get("email")).trim().toLowerCase();
    const password = String(d.get("password"));
    const accounts = read<{ email: string; hash: string; name: string }[]>(
      "accounts",
      [],
    );
    const bytes = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(password),
    );
    const hash = Array.from(new Uint8Array(bytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    if (signup) {
      if (accounts.some((a) => a.email === email)) {
        setError("An account already exists. Please log in.");
        return;
      }
      const name = String(d.get("name")).trim();
      write("accounts", [...accounts, { email, hash, name }]);
      setUser({ email, name, bio: "Sydney commuter", guest: false });
      nav("/profile/setup");
    } else {
      const account = accounts.find(
        (a) => a.email === email && a.hash === hash,
      );
      if (!account) {
        setError(
          "Email or password does not match. Sign up first, or continue as guest.",
        );
        return;
      }
      const profiles = read<Record<string, User>>("profiles", {});
      setUser(
        profiles[email] || {
          email,
          name: account.name,
          bio: "Sydney commuter",
          guest: false,
        },
      );
      nav("/plan");
    }
  };
  return (
    <main className="auth">
      <Link to="/" className="back">
        <ArrowLeft size={18} />
        Back
      </Link>
      <div className="brand-large">
        <Navigation />{" "}
      </div>
      <Intro
        eyebrow="YOUR NEXT STOP"
        title={
          signup ? "A better journey starts here." : "Good to see you again."
        }
      >
        Less uncertainty. More confidence on your commute.
      </Intro>
      <form onSubmit={submit} className="stack">
        {signup && (
          <label>
            Your name
            <input
              name="name"
              required
              maxLength={50}
              placeholder="Alex Chen"
            />
          </label>
        )}
        <label>
          Email address
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            minLength={6}
            maxLength={128}
            placeholder="At least 6 characters"
          />
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="primary">
          {signup ? "Create account" : "Log in"}
          <ArrowRight size={18} />
        </button>
      </form>
      <p className="center">
        {signup ? "Already a member?" : "New to SydneyGo?"}{" "}
        <Link to={signup ? "/login" : "/signup"}>
          {signup ? "Log in" : "Sign up"}
        </Link>
      </p>
      <button
        className="secondary"
        onClick={() => {
          setUser({
            name: "Guest commuter",
            email: "",
            bio: "Exploring Sydney",
            guest: true,
          });
          nav("/plan");
        }}
      >
        Continue as Guest
      </button>
      <p className="fine">
        Single-device demo authentication. Password hashes are stored locally;
        this is not secure production authentication. Do not use a real
        password.
      </p>
    </main>
  );
}
