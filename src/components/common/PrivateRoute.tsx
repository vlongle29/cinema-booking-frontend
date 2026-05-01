import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PrivateRoute: React.FC = () => {
   const { isAuthenticated, loading } = useAuth();
   const location = useLocation();

   if (loading) {
      return <div>Loading...</div>;
   }

   return isAuthenticated ? (
      <Outlet />
   ) : (
      <Navigate to="/" state={{ from: location }} replace />
   );
};

export default PrivateRoute;
