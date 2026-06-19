import { useState } from "react";
import { AlertCircle, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import { LoginModal } from "@/features/auth/components";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import type { Showtime, Theater } from "../types/showtime.types";
import DateStrip from "./DataStrip";
import FilterChips from "./FilterChips";
import TheaterCard from "./TheaterCard";
import useShowtimeSelection from "../hooks/useShowtimeSelection";
import SelectionSummary from "./SelectionSummary";
import BlurredCircle from "@/components/ui/BlurredCircle";

// ============================================================================
// Main Showtime Selection Component
// ============================================================================

export default function ShowtimeSelection() {
   const navigate = useNavigate();
   const { isAuthenticated } = useAuth();
   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

   // Get all datas and setter function from Custom Hook
   const {
      dates,
      selectedDate,
      setSelectedDate,
      datesApi,
      cities,
      selectedCity,
      setSelectedCity,
      citiesApi,
      formats,
      selectedFormat,
      setSelectedFormat,
      formatsApi,
      theaters,
      theatersApi,
      selectedShowtime,
      setSelectedShowtime,
   } = useShowtimeSelection();

   console.log("theaters", theaters);
   

   // Find selected date object for display
   const selectedDateObj = dates.find((d) => d.date === selectedDate);

   // Helper function to translate common format names
   const translateFormatName = (name: string): string => {
      switch (name.toLowerCase()) {
         case "standard":
            return "Tiêu chuẩn";
         case "imax":
            return "IMAX";
         case "4dx":
            return "4DX";
         default:
            return name; // Return original name if no translation found
      }
   };

   return (
      <div className="min-h-screen bg-[#09090b]">
         <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {/* Page Header */}
            <div className="mb-6 md:mb-8 relative">
               <div className="flex items-center gap-2 mb-2">
                  <BlurredCircle className="left-0 top-10" />
                  <BlurredCircle className="right-0 top-10" />
                  <Film className="w-5 h-5 text-[#f84565]" />
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                     Chọn
                     <span className="text-[#f84565]"> Suất Chiếu</span>
                  </h1>
               </div>
               <p className="text-sm text-[#797b7d]">
                  Hãy chọn ngày, địa điểm, định dạng và thời gian bạn muốn
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
                     Chọn ngày:{" "}
                     <span className="text-[#f84565] font-semibold">
                        {selectedDateObj.fullDate}
                     </span>
                  </p>
               </div>
            )}

            {/* Step 2: City Selection */}
            {!datesApi.loading && (
               <FilterChips
                  label="Chọn thành phố"
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
                  label="Chọn định dạng"
                  items={formats}
                  selected={selectedFormat}
                  onSelect={setSelectedFormat}
                  loading={formatsApi.loading}
                  itemNameFormatter={translateFormatName} // Truyền hàm dịch vào đây
                  error={formatsApi.error}
                  isEmpty={formats.length === 0}
               />
            )}

            {/* Step 4: Theater & Showtime Selection */}
            {!formatsApi.loading && selectedFormat && (
               <div>
                  <h3 className="text-base font-semibold text-white mb-4">
                     Rạp & Suất chiếu có sẵn
                  </h3>

                  {theatersApi.loading ? (
                     <SkeletonLoader count={3} type="theater" />
                  ) : theatersApi.error ? (
                     <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-400 text-sm">
                           {theatersApi.error}
                        </span>
                     </div>
                  ) : theaters.length === 0 && !theatersApi.loading ? (
                     <EmptyState
                        title="Không có rạp chiếu nào"
                        description="Rất tiếc, không có suất chiếu nào khả dụng cho lựa chọn của bạn. Vui lòng thử ngày, thành phố hoặc định dạng khác."
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
                  formatName={
                     formats.find((f) => f.id === selectedFormat)?.name
                  }
                  theaterName={selectedShowtime.theater.name}
                  showtime={selectedShowtime.showtime.time}
                  onProceed={() => {
                     if (isAuthenticated && selectedShowtime.showtime) {
                        if (selectedShowtime.showtime.id) {
                           navigate(
                              `/seat-select/${selectedShowtime.showtime.id}`,
                           );
                        }
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
               // Tương tự cho trường hợp đăng nhập thành công
               if (selectedShowtime?.showtime.id) {
                  navigate(`/seat-select/${selectedShowtime.showtime.id}`);
               }
            }}
         />
      </div>
   );
}
