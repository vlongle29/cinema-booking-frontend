import { useState } from "react";
import {
   AlertCircle,
   Film,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoginModal from "../components/common/LoginModal";
import type { Showtime, Theater } from "../types/showtime";
import SkeletonLoader from "../components/common/SkeletonLoader";
import EmptyState from "../components/common/EmptyState";
import DateStrip from "../components/showtime/DataStrip";
import FilterChips from "../components/showtime/FilterChips";
import TheaterCard from "../components/showtime/TheaterCard";
import useShowtimeSelection from "../hooks/useShowtimeSelection";
import SelectionSummary from "../components/showtime/SelectionSummary";


// ============================================================================
// Main Showtime Selection Component
// ============================================================================

export default function ShowtimeSelection() {
   const navigate = useNavigate();
   const { isAuthenticated } = useAuth();
   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

   // Get all datas and setter function from Custom Hook
   const {
      dates, selectedDate, setSelectedDate, datesApi,
      cities, selectedCity, setSelectedCity, citiesApi,
      formats, selectedFormat, setSelectedFormat, formatsApi,
      theaters, theatersApi,
      selectedShowtime, setSelectedShowtime
   } = useShowtimeSelection();

  // Find selected date object for display
   const selectedDateObj = dates.find((d) => d.date === selectedDate);

   return (
      <div className="min-h-screen bg-[#09090b]">
         <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {/* Page Header */}
            <div className="mb-6 md:mb-8">
               <div className="flex items-center gap-2 mb-2">
                  <Film className="w-5 h-5 text-[#f84565]" />
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                     Select Your
                     <span className="text-[#f84565]"> Showtime</span>
                  </h1>
               </div>
               <p className="text-sm text-[#797b7d]">
                  Choose your preferred date, location, format, and time
               </p>
            </div>

            {/* Step 1: Date Selection */}
            <DateStrip
               dates={dates}
               selectedDate={selectedDate}
               onSelectDate={setSelectedDate}
               loading={datesApi.loading}
            />

            {/* Selected Date Info */}
            {selectedDateObj && !datesApi.loading && (
               <div className="mb-4 p-3 bg-[#f84565]/10 border border-[#f84565]/30 rounded-lg">
                  <p className="text-sm text-[#d1d5dc]">
                     Selected Date:{" "}
                     <span className="text-[#f84565] font-semibold">
                        {selectedDateObj.fullDate}
                     </span>
                  </p>
               </div>
            )}

            {/* Step 2: City Selection */}
            {!datesApi.loading && (
               <FilterChips
                  label="Select City"
                  items={cities}
                  selected={selectedCity}
                  onSelect={setSelectedCity}
                  loading={citiesApi.loading}
                  error={citiesApi.error}
                  isEmpty={cities.length === 0}
               />
            )}

            {/* Step 3: Format Selection */}
            {!citiesApi.loading && selectedCity && (
               <FilterChips
                  label="Select Format"
                  items={formats}
                  selected={selectedFormat}
                  onSelect={setSelectedFormat}
                  loading={formatsApi.loading}
                  error={formatsApi.error}
                  isEmpty={formats.length === 0}
               />
            )}

            {/* Step 4: Theater & Showtime Selection */}
            {!formatsApi.loading && selectedFormat && (
               <div>
                  <h3 className="text-base font-semibold text-white mb-4">
                     Available Theaters & Showtimes
                  </h3>

                  {theatersApi.loading ? (
                     <SkeletonLoader count={3} type="theater" />
                  ) : theatersApi.error ? (
                     <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-400">
                           {theatersApi.error}
                        </span>
                     </div>
                  ) : theaters.length === 0 ? (
                     <EmptyState
                        title="No theaters available"
                        description="Unfortunately, there are no available showtimes for your selection. Please try a different date, city, or format."
                     />
                  ) : (
                     <div className="space-y-3">
                        {theaters.map((theater) => (
                           <TheaterCard
                              key={theater.id}
                              theater={theater}
                               onShowtimeSelect={(t: Theater, s: Showtime) =>
                                  setSelectedShowtime({
                                     theater: t,
                                     showtime: s,
                                  })
                               }
                           />
                        ))}
                     </div>
                  )}
               </div>
            )}

            {/* Selected Showtime Summary */}
            {selectedShowtime && (
               <SelectionSummary
                  selectedDate={selectedDateObj?.fullDate}
                  cityName={cities.find((c) => c.id === selectedCity)?.name}
                  formatName={formats.find((f) => f.id === selectedFormat)?.name}
                  theaterName={selectedShowtime.theater.name}
                  showtime={selectedShowtime.showtime.time}
                  onProceed={() => {
                     if (isAuthenticated) {
                        navigate("/seat-select");
                     } else {
                        setIsLoginModalOpen(true);
                     }
                  }}
               />
            )}
         </div>

         <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={() => {
               setIsLoginModalOpen(false);
               navigate("/seat-select");
            }}
         />
      </div>
   );
}
