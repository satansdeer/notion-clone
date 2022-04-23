import { Navigate, Route, Routes } from "react-router-dom";
import { Page } from "./Page";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });
  }, []);

  return !session ? (
    <Auth />
  ) : (
    <Routes>
      <Route path="/:id" element={<Page />} />
      <Route path="/" element={<Navigate to="/start" />} />
    </Routes>
  );
}

export default App;
