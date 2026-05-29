import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardHome from "@/features/dashboard/domains/statistical/DashboardHome";
import MovieManagementPage from "./domains/movie/MovieManagementPage";
import ShowtimeManagementPage from "./domains/showtime/ShowtimeManagementPage";
import BookingManagementPage from "./domains/booking/BookingManagementPage";
import SeatTemplateManagementPage from "./domains/seat-template/SeatTemplateManagementPage";
import UserManagementPage from "./domains/user/UserManagementPage";

export default function Dashboard() {
   return (
      <Routes>
         <Route element={<DashboardLayout />}>
            {/* Các route dưới đây sẽ được render vào vị trí <Outlet /> trong DashboardLayout */}
            <Route index element={<DashboardHome />} />
            <Route path="list-movies" element={<MovieManagementPage />} />
            <Route path="list-shows" element={<ShowtimeManagementPage />} />
            <Route path="list-bookings" element={<BookingManagementPage />} />
            <Route path="seat-template" element={<SeatTemplateManagementPage />} />
            <Route path="user-manage" element={<UserManagementPage />} />
         </Route>
      </Routes>
   );
}
