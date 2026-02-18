import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import MoviesPage from "./pages/MoviesPage";
import ReleasesPage from "./pages/ReleasesPage";
import SeatSelectPage from "./features/booking/SeatSelectPage";
import MyBookingPage from "./pages/MyBookingPage";
import Dashboard from "./pages/dashboard/Dashboard";
import ShowtimeSelection from "./pages/ShowtimeSelection";
import NowShowingPage from "./pages/NowShowingPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import OrderSnacksPage from "./pages/OrderSnacksPage";
import CheckoutPage from "./pages/CheckoutPage";
import "./App.css";

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<Layout />}>
               <Route path="/" element={<HomePage />} />
               <Route path="/movies/:id" element={<MoviesPage />} />
               <Route path="/theatres" element={<MyBookingPage />} />
               <Route path="/releases" element={<ReleasesPage />} />
               {/* <Route path="/movie/:id" element={<DetailPage />} /> */}
               <Route path="/seat-select" element={<SeatSelectPage />} />
               <Route
                  path="/showtime-selection"
                  element={<ShowtimeSelection />}
               />
               <Route path="movies/now-showing" element={<NowShowingPage />} />
               <Route path="movies/coming-soon" element={<ComingSoonPage />} />
            </Route>
            {/* Dashboard routes - không qua Layout để giữ sidebar */}
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/order-snacks" element={<OrderSnacksPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
