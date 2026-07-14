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
import RoomManagementPage from "./domains/room/RoomManagementPage";
import RbacManagementPage from "./domains/rbac/RbacManagementPage";

export default function Dashboard() {
   return (
      <Routes>
         <Route element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="movie-manage" element={<MovieManagementPage />} />
            <Route path="showtime-manage" element={<ShowtimeManagementPage />} />
            <Route path="booking-manage" element={<BookingManagementPage />} />
            <Route
               path="seat-template-manage"
               element={<SeatTemplateManagementPage />}
            />
            <Route
               path="customer-manage"
               element={<CustomerManagementPage />}
            />
            <Route path="staff-manage" element={<StaffManagementPage />} />
            <Route
               path="user-manage"
               element={<Navigate to="/dashboard/customer-manage" replace />}
            />
            <Route path="branch-manage" element={<BranchManagementPage />} />
            <Route path="room-manage" element={<RoomManagementPage />} />
            <Route path="rbac-manage" element={<RbacManagementPage />} />
         </Route>
      </Routes>
   );
}
