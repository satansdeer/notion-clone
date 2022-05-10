import { Navigate } from "react-router-dom";
import { useAuthSession } from "./AuthSessionContext";

export const Private = ({ component }: any) => {
  const { session, loading } = useAuthSession();
	if (loading) {
		return <>Authenticating...</>;
	}

  return session ? component : <Navigate to="/auth" />;
};
