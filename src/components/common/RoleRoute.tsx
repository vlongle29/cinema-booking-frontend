import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import { useAuthz } from "@/hooks/useAuthz";

interface RoleRouteProps {
   allowedRoles: string[];
   redirectTo?: string;
}

const RoleRoute: React.FC<RoleRouteProps> = ({
   allowedRoles,
   redirectTo = "/",
}) => {
   const { isAuthenticated, loading } = useAuth();
   const { hasAnyRole } = useAuthz();

   if (loading) {
      return (
         <div className="text-white flex items-center justify-center min-h-[200px]">
            Đang tải...
         </div>
      );
   }

   if (!isAuthenticated) {
      return <Navigate to="/" replace />;
   }

   if (!hasAnyRole(allowedRoles)) {
      return <Navigate to={redirectTo} replace />;
   }

   return <Outlet />;
};

export default RoleRoute;
