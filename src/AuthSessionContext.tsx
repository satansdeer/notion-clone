import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthSessionContext = createContext({} as any);

export const AuthSessionProvider = ({ children }: any) => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthSessionContext.Provider value={{ session }}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => useContext(AuthSessionContext);
