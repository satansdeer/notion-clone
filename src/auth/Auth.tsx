import { FormEvent } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthSession } from "./AuthSessionContext";
import { supabase } from "../supabaseClient";
import styles from "../utils.module.css";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { session } = useAuthSession();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert((error as any).error_description || (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.centeredFlex}>
      <div aria-live="polite">
        <h1>ZTM Notes App</h1>
        <p>Sign in via magic link with your email below</p>
        {loading ? (
          "Sending magic link..."
        ) : (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email: </label>
            <input
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button aria-live="polite">Send magic link</button>
          </form>
        )}
      </div>
    </div>
  );
}
