import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardHome from "@/features/dashboard/domains/statistical/DashboardHome";
import MovieManagementPage from "./domains/movie/MovieManagementPage";
import ShowtimeManagementPage from "./domains/showtime/ShowtimeManagementPage";
import BookingManagementPage from "./domains/booking/BookingManagementPage";
import SeatTemplateManagementPage from "./domains/seat-template/SeatTemplateManagementPage";
import CustomerManagementPage from "./domains/customer/CustomerManagementPage";
import StaffManagementPage from "./domains/staff/StaffManagementPage";
import BranchManagementPage from "./domains/branch/BranchManagementPage";
import CityManagementPage from "./domains/city/CityManagementPage";
import RoomManagementPage from "./domains/room/RoomManagementPage";
import RbacManagementPage from "./domains/rbac/RbacManagementPage";
import { useAuthz, ROLES } from "@/hooks/useAuthz";

const RoleRoute = ({
   children,
   allowedRoles,
}: {
   children: React.ReactNode;
   allowedRoles: string[];
}) => {
   const { hasAnyRole } = useAuthz();
   if (!hasAnyRole(allowedRoles)) {
      // Redirect users to their default dashboard page or home if they access an unauthorized route
      if (hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN])) {
         return <Navigate to="/dashboard" replace />;
      }
      if (hasAnyRole([ROLES.MANAGER])) {
         return <Navigate to="/dashboard/showtime-manage" replace />;
      }
      if (hasAnyRole([ROLES.STAFF])) {
         return <Navigate to="/dashboard/booking-manage" replace />;
      }
      return <Navigate to="/" replace />;
   }
   return <>{children}</>;
};

export default function Dashboard() {
   const { hasAnyRole } = useAuthz();

   return (
      <Routes>
         <Route element={<DashboardLayout />}>
            <Route 
               index 
               element={
                  hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]) ? (
                     <DashboardHome />
                  ) : hasAnyRole([ROLES.MANAGER]) ? (
                     <Navigate to="/dashboard/showtime-manage" replace />
                  ) : hasAnyRole([ROLES.STAFF]) ? (
                     <Navigate to="/dashboard/booking-manage" replace />
                  ) : (
                     <Navigate to="/" replace />
                  )
               } 
            />
            <Route
               path="movie-manage"
               element={
                  <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                     <MovieManagementPage />
                  </RoleRoute>
               }
            />
            <Route
               path="showtime-manage"
               element={
                  <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER]}>
                     <ShowtimeManagementPage />
                  </RoleRoute>
               }
            />
            <Route
               path="booking-manage"
               element={
                  <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                     <BookingManagementPage />
                  </RoleRoute>
               }
            />
            <Route
               path="seat-template-manage"
               element={
                  <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER]}>
                     <SeatTemplateManagementPage />
                  </RoleRoute>
               }
            />
            <Route
               path="customer-manage"
               element={
                  <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                     <CustomerManagementPage />
                  </RoleRoute>
               }
            />
            <Route
               path="staff-manage"
               element={
                  <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                     <StaffManagementPage />
                  </RoleRoute>
               }
            />
            <Route
               path="user-manage"
               element={<Navigate to="/dashboard/customer-manage" replace />}
            />
            <Route
               path="branch-manage"
               element={
                  <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                     <BranchManagementPage />
                  </RoleRoute>
               }
            />
            <Route
               path="city-manage"
               element={
                  <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                     <CityManagementPage />
                  </RoleRoute>
               }
            />
            <Route
               path="room-manage"
               element={
                  <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER]}>
                     <RoomManagementPage />
                  </RoleRoute>
               }
            />
            <Route
               path="rbac-manage"
               element={
                  <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                     <RbacManagementPage />
                  </RoleRoute>
               }
            />
         </Route>
      </Routes>
   );
}
