import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthSessionContext = createContext({} as any);

export const AuthSessionProvider = ({ children }: any) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  useEffect(() => {
    setSession(supabase.auth.session());
    setLoading(false);

    supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  return (
    <AuthSessionContext.Provider value={{ session, loading }}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => useContext(AuthSessionContext);
