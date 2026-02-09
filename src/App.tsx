import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import MoviesPage from "./pages/MoviesPage";
import ReleasesPage from "./pages/ReleasesPage";
import SeatSelectPage from "./pages/SeatSellectPage";
import MyBookingPage from "./pages/MyBookingPage";
import Dashboard from "./pages/dashboard/Dashboard";
import ShowtimeSelection from "./pages/ShowtimeSelection";
import "./App.css";

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<Layout />}>
               <Route path="/" element={<HomePage />} />
               <Route path="/movies" element={<MoviesPage />} />
               <Route path="/theatres" element={<MyBookingPage />} />
               <Route path="/releases" element={<ReleasesPage />} />
               <Route path="/movie/:id" element={<DetailPage />} />
               <Route path="/seat-select" element={<SeatSelectPage />} />
               <Route path="/showtime-selection" element={<ShowtimeSelection />} />
            </Route>
            {/* Dashboard routes - không qua Layout để giữ sidebar */}
            <Route path="/dashboard/*" element={<Dashboard />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
