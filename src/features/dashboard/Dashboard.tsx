import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardHome from "@/features/dashboard/domains/statistical/DashboardHome";
import MovieManagementPage from "./domains/movie/MovieManagementPage";
import ShowtimeManagementPage from "./domains/showtime/ShowtimeManagementPage";
import BookingManagementPage from "./domains/booking/BookingManagementPage";
import SeatTemplateManagementPage from "./domains/seat-template/SeatTemplateManagementPage";
import UserManagementPage from "./domains/user/UserManagementPage";
import BranchManagementPage from "./domains/branch/BranchManagementPage";

export default function Dashboard() {
   return (
      <Routes>
         <Route element={<DashboardLayout />}>
            {/* Các route dưới đây sẽ được render vào vị trí <Outlet /> trong DashboardLayout */}
            <Route index element={<DashboardHome />} />
            <Route path="movie-manage" element={<MovieManagementPage />} />
            <Route path="showtime-manage" element={<ShowtimeManagementPage />} />
            <Route path="booking-manage" element={<BookingManagementPage />} />
            <Route
               path="seat-template-manage"
               element={<SeatTemplateManagementPage />}
            />
            <Route path="user-manage" element={<UserManagementPage />} />
            <Route path="branch-manage" element={<BranchManagementPage />} />
         </Route>
      </Routes>
   );
}
