import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth.util";

const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;