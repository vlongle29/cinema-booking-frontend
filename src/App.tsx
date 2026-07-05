import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/TicketBookingDetailPage";
import SeatSelectPage from "@/features/booking/components/SeatSelectPage";
import MyBookingPage from "./pages/MyBookingPage";
import Dashboard from "./features/dashboard/Dashboard";
import ShowtimeSelection from "./features/showtime/components/ShowtimeSelection";
import ListMoviePage from "./pages/ListMoviesPage";
import OrderSnacksPage from "./pages/OrderSnacksPage";
import CheckoutPage from "./pages/CheckoutPage";
import { Toaster } from "react-hot-toast";
import "./App.css";
import PrivateRoute from "./components/common/PrivateRoute";
import { PaymentSuccess } from "./pages/PaymentSuccessPage";
import MainLayout from "./layouts/MainLayout";
import GoogleOAuth2Callback from "./features/auth/components/GoogleCallback";
import ProfilePage from "./pages/ProfilePage";

function App() {
   return (
      <BrowserRouter>
         <Toaster position="top-right" reverseOrder={false} />
         <Routes>
            {/* 1. LUỒNG KHÁCH HÀNG (Sử dụng MainLayout) */}
            <Route element={<MainLayout />}>
               <Route path="/" element={<HomePage />} />
               <Route path="/movies/:id" element={<MoviesPage />} />
               {/* <Route path="/movie/:id" element={<DetailPage />} /> */}
               <Route
                  path="/showtime-selection"
                  element={<ShowtimeSelection />}
               />
               <Route
                  path="movies/status/:status"
                  element={<ListMoviePage />}
               />
               <Route
                  path="/oauth2/google/callback"
                  element={<GoogleOAuth2Callback />}
               />
               {/* Protected Routes */}
               <Route element={<PrivateRoute />}>
                  {/* {/* <Route path="profile" element={<div>User Profile</div>} /> */}
                  <Route path="/order-snacks" element={<OrderSnacksPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/seat-select/:id" element={<SeatSelectPage />} />
                  <Route path="/booking/success" element={<PaymentSuccess />} />
                  <Route path="/my-bookings" element={<MyBookingPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
               </Route>
            </Route>
            <Route element={<PrivateRoute />}>
               {/* 2. LUỒNG QUẢN TRỊ (Sử dụng DashboardLayout bên trong Dashboard component) */}
               <Route path="/dashboard/*" element={<Dashboard />} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
}

export default App;
