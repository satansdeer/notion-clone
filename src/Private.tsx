import { Navigate } from "react-router-dom";
import { useAuthSession } from "./AuthSessionContext";

export const Private = ({ component }: any) => {
  const { session } = useAuthSession();
  return session ? component : <Navigate to="/auth" />;
};
