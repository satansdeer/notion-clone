import { Session } from "@supabase/supabase-js";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type AuthSessionContextValue = {
  session: ReturnType<typeof supabase.auth.session>;
	loading: boolean
};

const AuthSessionContext = createContext<AuthSessionContextValue>({} as any);

export const AuthSessionProvider: FC<{}> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(supabase.auth.session());
    setLoading(false);

    supabase.auth.onAuthStateChange((_event, session) => {
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
