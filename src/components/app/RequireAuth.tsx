import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "@/lib/session";

/** Protège les routes de l'app : redirige vers /connexion si non connecté. */
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  if (!getUser()) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

export default RequireAuth;
