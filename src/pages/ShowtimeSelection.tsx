import React, { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
   ChevronLeft,
   ChevronRight,
   AlertCircle,
   Clock,
   MapPin,
   Film,
} from "lucide-react";

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface DateOption {
   date: string;
   day: string;
   dateNum: number;
   fullDate: string;
}

interface City {
   id: string;
   name: string;
   count: number;
}

interface Format {
   id: string;
   name: string;
   badge?: string;
}

interface Showtime {
   id: string;
   time: string;
   isPeak: boolean;
   isSoldOut: boolean;
   availableSeats: number;
}

interface Theater {
   id: string;
   name: string;
   location: string;
   showtimes: Showtime[];
}

interface ApiState {
   loading: boolean;
   error: string | null;
}

// ============================================================================
// Mock API Functions (Replace with real fetch/axios calls later)
// ============================================================================

// Simulate API call with delay
const simulateApiDelay = (ms: number = 1000) =>
   new Promise((resolve) => setTimeout(resolve, ms));

// Mock: Fetch dates (runs on initial load)
const fetchDates = async (): Promise<DateOption[]> => {
   await simulateApiDelay(500);

   const today = new Date();
   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   const dates: DateOption[] = [];

   for (let i = 0; i < 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);

      dates.push({
         date: nextDate.toISOString().split("T")[0],
         day: days[nextDate.getDay()],
         dateNum: nextDate.getDate(),
         fullDate: nextDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
         }),
      });
   }

   return dates;
};

// Mock: Fetch cities based on selected date
const fetchCities = async (selectedDate: string): Promise<City[]> => {
   await simulateApiDelay(800);

   const mockCities: Record<string, City[]> = {
      default: [
         { id: "hcm", name: "Ho Chi Minh City", count: 12 },
         { id: "hanoi", name: "Hanoi", count: 8 },
         { id: "danang", name: "Da Nang", count: 5 },
         { id: "hue", name: "Hue", count: 3 },
         { id: "vung_tau", name: "Vung Tau", count: 2 },
      ],
   };

   // Simulate different data based on date (optional)
   if (selectedDate.includes("2025-02-1")) {
      return mockCities.default.slice(0, 4);
   }

   return mockCities.default;
};

// Mock: Fetch formats based on selected city
const fetchFormats = async (
   selectedDate: string,
   selectedCity: string,
): Promise<Format[]> => {
   await simulateApiDelay(800);

   const mockFormats: Record<string, Format[]> = {
      hcm: [
         { id: "2d", name: "2D", badge: "Standard" },
         { id: "imax", name: "IMAX", badge: "Premium" },
         { id: "4dx", name: "4DX", badge: "Experience" },
         { id: "screenx", name: "ScreenX", badge: "Premium" },
      ],
      hanoi: [
         { id: "2d", name: "2D", badge: "Standard" },
         { id: "imax", name: "IMAX", badge: "Premium" },
      ],
      danang: [
         { id: "2d", name: "2D", badge: "Standard" },
         { id: "4dx", name: "4DX", badge: "Experience" },
      ],
      default: [
         { id: "2d", name: "2D", badge: "Standard" },
         { id: "imax", name: "IMAX", badge: "Premium" },
         { id: "4dx", name: "4DX", badge: "Experience" },
      ],
   };

   return mockFormats[selectedCity] || mockFormats.default;
};

// Mock: Fetch theaters & showtimes based on all selections
const fetchTheaters = async (
   selectedDate: string,
   selectedCity: string,
   selectedFormat: string,
): Promise<Theater[]> => {
   await simulateApiDelay(1000);

   // Simulate no data for certain combinations
   if (selectedCity === "vung_tau") {
      return [];
   }

   const mockTheaters: Theater[] = [
      {
         id: "theater_1",
         name: "CGV Landmark 81",
         location: "Ho Chi Minh City",
         showtimes: [
            {
               id: "t1_s1",
               time: "09:00 AM",
               isPeak: false,
               isSoldOut: false,
               availableSeats: 45,
            },
            {
               id: "t1_s2",
               time: "12:00 PM",
               isPeak: true,
               isSoldOut: false,
               availableSeats: 12,
            },
            {
               id: "t1_s3",
               time: "03:30 PM",
               isPeak: true,
               isSoldOut: false,
               availableSeats: 8,
            },
            {
               id: "t1_s4",
               time: "06:45 PM",
               isPeak: true,
               isSoldOut: false,
               availableSeats: 3,
            },
            {
               id: "t1_s5",
               time: "09:30 PM",
               isPeak: false,
               isSoldOut: true,
               availableSeats: 0,
            },
         ],
      },
      {
         id: "theater_2",
         name: "BHD Star Cineplex",
         location: "Ho Chi Minh City",
         showtimes: [
            {
               id: "t2_s1",
               time: "10:00 AM",
               isPeak: false,
               isSoldOut: false,
               availableSeats: 52,
            },
            {
               id: "t2_s2",
               time: "01:15 PM",
               isPeak: true,
               isSoldOut: false,
               availableSeats: 18,
            },
            {
               id: "t2_s3",
               time: "04:00 PM",
               isPeak: true,
               isSoldOut: false,
               availableSeats: 9,
            },
            {
               id: "t2_s4",
               time: "07:00 PM",
               isPeak: true,
               isSoldOut: false,
               availableSeats: 15,
            },
            {
               id: "t2_s5",
               time: "10:00 PM",
               isPeak: false,
               isSoldOut: false,
               availableSeats: 38,
            },
         ],
      },
      {
         id: "theater_3",
         name: "Lotte Cinema Saigon",
         location: "Ho Chi Minh City",
         showtimes: [
            {
               id: "t3_s1",
               time: "09:30 AM",
               isPeak: false,
               isSoldOut: false,
               availableSeats: 60,
            },
            {
               id: "t3_s2",
               time: "12:30 PM",
               isPeak: true,
               isSoldOut: false,
               availableSeats: 5,
            },
            {
               id: "t3_s3",
               time: "03:45 PM",
               isPeak: true,
               isSoldOut: true,
               availableSeats: 0,
            },
            {
               id: "t3_s4",
               time: "07:15 PM",
               isPeak: true,
               isSoldOut: false,
               availableSeats: 22,
            },
            {
               id: "t3_s5",
               time: "10:15 PM",
               isPeak: false,
               isSoldOut: false,
               availableSeats: 41,
            },
         ],
      },
   ];

   // Filter based on city selection (simple simulation)
   if (selectedCity !== "hcm") {
      return mockTheaters.slice(0, 2);
   }

   return mockTheaters;
};

// ============================================================================
// Skeleton Loader Component
// ============================================================================

const SkeletonLoader: React.FC<{ count?: number; type?: string }> = ({
   count = 3,
   type = "chip",
}) => {
   if (type === "chip") {
      return (
         <div className="flex gap-3 flex-wrap">
            {Array(count)
               .fill(0)
               .map((_, i) => (
                  <div
                     key={i}
                     className="h-10 w-24 bg-[#252529] rounded-full animate-pulse"
                  />
               ))}
         </div>
      );
   }

   if (type === "theater") {
      return (
         <div className="space-y-4">
            {Array(count)
               .fill(0)
               .map((_, i) => (
                  <div
                     key={i}
                     className="bg-[#1a1a1e] rounded-lg p-4 animate-pulse"
                  >
                     <div className="h-4 bg-[#252529] rounded w-1/3 mb-3" />
                     <div className="h-3 bg-[#252529] rounded w-1/4 mb-4" />
                     <div className="flex gap-2">
                        {Array(5)
                           .fill(0)
                           .map((_, j) => (
                              <div
                                 key={j}
                                 className="h-8 w-16 bg-[#252529] rounded"
                              />
                           ))}
                     </div>
                  </div>
               ))}
         </div>
      );
   }

   return null;
};

// ============================================================================
// Empty State Component
// ============================================================================

const EmptyState: React.FC<{ title: string; description: string }> = ({
   title,
   description,
}) => (
   <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="w-12 h-12 text-[#f84565] mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#797b7d] text-sm max-w-sm">{description}</p>
   </div>
);

// ============================================================================
// Date Strip Component
// ============================================================================

const DateStrip: React.FC<{
   dates: DateOption[];
   selectedDate: string;
   onSelectDate: (date: string) => void;
   loading: boolean;
}> = ({ dates, selectedDate, onSelectDate, loading }) => {
   const [scrollPos, setScrollPos] = useState(0);
   const containerRef = React.useRef<HTMLDivElement>(null);

   const scroll = (direction: "left" | "right") => {
      if (containerRef.current) {
         const amount = 300;
         containerRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
         });
      }
   };

   return (
      <div className="mb-8">
         <h3 className="text-lg font-semibold text-white mb-4">Choose Date</h3>

         <div className="flex items-center gap-4">
            {/* Left Scroll Button */}
            <button
               onClick={() => scroll("left")}
               className="p-2 hover:bg-[#1a1a1e] rounded-lg transition-colors flex-shrink-0"
            >
               <ChevronLeft className="w-5 h-5 text-[#d1d5dc]" />
            </button>

            {/* Dates Container */}
            <div
               ref={containerRef}
               className="flex gap-3 overflow-x-auto flex-1 pb-2 scrollbar-hide"
            >
               {loading
                  ? Array(7)
                       .fill(0)
                       .map((_, i) => (
                          <div
                             key={i}
                             className="h-[70px] w-[70px] bg-[#252529] rounded-lg animate-pulse flex-shrink-0"
                          />
                       ))
                  : dates.map((d) => (
                       <button
                          key={d.date}
                          onClick={() => onSelectDate(d.date)}
                          className={`flex flex-col items-center justify-center w-[70px] h-[70px] rounded-lg font-medium transition-all flex-shrink-0 ${
                             selectedDate === d.date
                                ? "bg-[#f84565] text-white border-2 border-[#f84565]"
                                : "border-2 border-[#393939] text-[#d1d5dc] hover:border-[#f84565]"
                          }`}
                       >
                          <span className="text-xs">{d.day}</span>
                          <span className="text-lg font-bold">{d.dateNum}</span>
                       </button>
                    ))}
            </div>

            {/* Right Scroll Button */}
            <button
               onClick={() => scroll("right")}
               className="p-2 hover:bg-[#1a1a1e] rounded-lg transition-colors flex-shrink-0"
            >
               <ChevronRight className="w-5 h-5 text-[#d1d5dc]" />
            </button>
         </div>
      </div>
   );
};

// ============================================================================
// Filter Chips Component
// ============================================================================

const FilterChips: React.FC<{
   label: string;
   items: City[] | Format[];
   selected: string;
   onSelect: (id: string) => void;
   loading: boolean;
   error: string | null;
   isEmpty: boolean;
}> = ({ label, items, selected, onSelect, loading, error, isEmpty }) => {
   if (isEmpty && !loading) {
      return null;
   }

   return (
      <div className="mb-6">
         <h3 className="text-sm font-semibold text-[#d1d5dc] mb-3 uppercase tracking-wider">
            {label}
         </h3>

         {loading ? (
            <SkeletonLoader count={5} type="chip" />
         ) : error ? (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
               <AlertCircle className="w-4 h-4 text-red-500" />
               <span className="text-sm text-red-400">{error}</span>
            </div>
         ) : items.length === 0 ? (
            <EmptyState
               title="No options available"
               description={`No ${label.toLowerCase()} available for your selection`}
            />
         ) : (
            <div className="flex gap-2 flex-wrap">
               {items.map((item) => {
                  const isSelected = selected === item.id;
                  const itemName = "name" in item ? item.name : "";
                  const badge = "badge" in item ? item.badge : null;
                  const count = "count" in item ? item.count : null;

                  return (
                     <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                           isSelected
                              ? "bg-[#f84565] text-white"
                              : "bg-[#1a1a1e] text-[#d1d5dc] border border-[#393939] hover:border-[#f84565]"
                        }`}
                     >
                        <div className="flex items-center gap-2">
                           <span>{itemName}</span>
                           {badge && (
                              <span className="text-xs bg-[#f84565]/30 px-2 py-0.5 rounded">
                                 {badge}
                              </span>
                           )}
                           {count && (
                              <span className="text-xs opacity-75">
                                 ({count})
                              </span>
                           )}
                        </div>
                     </button>
                  );
               })}
            </div>
         )}
      </div>
   );
};

// ============================================================================
// Theater Card Component
// ============================================================================

const TheaterCard: React.FC<{
   theater: Theater;
   onShowtimeSelect: (theater: Theater, showtime: Showtime) => void;
}> = ({ theater, onShowtimeSelect }) => (
   <div className="bg-[#1a1a1e] border border-[#393939] rounded-lg p-5 hover:border-[#f84565] transition-colors">
      {/* Theater Header */}
      <div className="mb-4">
         <h3 className="text-white font-semibold text-lg mb-1">
            {theater.name}
         </h3>
         <div className="flex items-center gap-2 text-[#797b7d] text-sm">
            <MapPin className="w-4 h-4" />
            <span>{theater.location}</span>
         </div>
      </div>

      {/* Showtimes Grid */}
      <div className="grid grid-cols-5 gap-2">
         {theater.showtimes.map((showtime) => (
            <button
               key={showtime.id}
               onClick={() => onShowtimeSelect(theater, showtime)}
               disabled={showtime.isSoldOut}
               className={`py-2 px-2 rounded-lg font-medium text-sm transition-all ${
                  showtime.isSoldOut
                     ? "bg-[#252529] text-[#797b7d] cursor-not-allowed opacity-50"
                     : showtime.isPeak
                       ? "bg-[#f84565] text-white hover:bg-[#f84565]/90"
                       : "bg-[#252529] text-[#d1d5dc] border border-[#393939] hover:border-[#f84565]"
               }`}
            >
               <div className="flex flex-col items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{showtime.time}</span>
                  {showtime.isSoldOut && (
                     <span className="text-xs">Sold Out</span>
                  )}
               </div>
            </button>
         ))}
      </div>

      {/* Peak Hours Note */}
      <p className="text-xs text-[#797b7d] mt-4">
         <span className="inline-block w-3 h-3 bg-[#f84565] rounded-full mr-2" />
         Peak hours (Premium pricing)
      </p>
   </div>
);

// ============================================================================
// Main Showtime Selection Component
// ============================================================================

interface ShowtimeSelectionProps {
   dates: { day: string; date: string }[];
   selectedDate: string;
   onSelectDate: Dispatch<SetStateAction<string>>;
}

export default function ShowtimeSelection() {
   // State management
   const [dates, setDates] = useState<DateOption[]>([]);
   const [selectedDate, setSelectedDate] = useState<string>("");
   const [cities, setCities] = useState<City[]>([]);
   const [selectedCity, setSelectedCity] = useState<string>("");
   const [formats, setFormats] = useState<Format[]>([]);
   const [selectedFormat, setSelectedFormat] = useState<string>("");
   const [theaters, setTheaters] = useState<Theater[]>([]);
   const [selectedShowtime, setSelectedShowtime] = useState<{
      theater: Theater;
      showtime: Showtime;
   } | null>(null);

   // Loading states
   const [datesApi, setDatesApi] = useState<ApiState>({
      loading: true,
      error: null,
   });
   const [citiesApi, setCitiesApi] = useState<ApiState>({
      loading: false,
      error: null,
   });
   const [formatsApi, setFormatsApi] = useState<ApiState>({
      loading: false,
      error: null,
   });
   const [theatersApi, setTheatersApi] = useState<ApiState>({
      loading: false,
      error: null,
   });

   // Initial load: Fetch dates
   useEffect(() => {
      const loadDates = async () => {
         try {
            const data = await fetchDates();
            setDates(data);
            setSelectedDate(data[0].date);
            setDatesApi({ loading: false, error: null });
         } catch (error) {
            setDatesApi({
               loading: false,
               error: "Failed to load dates. Please try again.",
            });
         }
      };

      loadDates();
   }, []);

   // Step 1: When date changes, fetch cities
   useEffect(() => {
      if (!selectedDate) return;

      const loadCities = async () => {
         setCitiesApi({ loading: true, error: null });
         setSelectedCity(""); // Reset city selection
         setFormats([]);
         setSelectedFormat("");
         setTheaters([]);

         try {
            const data = await fetchCities(selectedDate);
            setCities(data);
            setCitiesApi({ loading: false, error: null });
         } catch (error) {
            setCitiesApi({
               loading: false,
               error: "Failed to load cities. Please try again.",
            });
         }
      };

      loadCities();
   }, [selectedDate]);

   // Step 2: When city changes, fetch formats
   useEffect(() => {
      if (!selectedCity || !selectedDate) return;

      const loadFormats = async () => {
         setFormatsApi({ loading: true, error: null });
         setSelectedFormat(""); // Reset format selection
         setTheaters([]);

         try {
            const data = await fetchFormats(selectedDate, selectedCity);
            setFormats(data);
            setFormatsApi({ loading: false, error: null });
         } catch (error) {
            setFormatsApi({
               loading: false,
               error: "Failed to load formats. Please try again.",
            });
         }
      };

      loadFormats();
   }, [selectedCity, selectedDate]);

   // Step 3: When format changes, fetch theaters
   useEffect(() => {
      if (!selectedFormat || !selectedCity || !selectedDate) return;

      const loadTheaters = async () => {
         setTheatersApi({ loading: true, error: null });
         setSelectedShowtime(null);

         try {
            const data = await fetchTheaters(
               selectedDate,
               selectedCity,
               selectedFormat,
            );
            setTheaters(data);
            setTheatersApi({ loading: false, error: null });
         } catch (error) {
            setTheatersApi({
               loading: false,
               error: "Failed to load theaters. Please try again.",
            });
         }
      };

      loadTheaters();
   }, [selectedFormat, selectedCity, selectedDate]);

   // Find selected date object for display
   const selectedDateObj = dates.find((d) => d.date === selectedDate);

   return (
      <div className="min-h-screen bg-[#09090b]">
         <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Page Header */}
            <div className="mb-12">
               <div className="flex items-center gap-3 mb-4">
                  <Film className="w-6 h-6 text-[#f84565]" />
                  <h1 className="text-4xl font-bold text-white">
                     Select Your
                     <span className="text-[#f84565]"> Showtime</span>
                  </h1>
               </div>
               <p className="text-[#797b7d]">
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
               <div className="mb-6 p-4 bg-[#f84565]/10 border border-[#f84565]/30 rounded-lg">
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
                  <h3 className="text-lg font-semibold text-white mb-6">
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
                     <div className="space-y-4">
                        {theaters.map((theater) => (
                           <TheaterCard
                              key={theater.id}
                              theater={theater}
                              onShowtimeSelect={(t, s) =>
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
               <div className="mt-8 p-5 bg-[#f84565]/10 border-2 border-[#f84565] rounded-lg">
                  <h3 className="text-white font-semibold mb-3">
                     Your Selection
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div>
                        <p className="text-[#797b7d] text-xs font-semibold uppercase">
                           Date
                        </p>
                        <p className="text-white font-semibold">
                           {selectedDateObj?.fullDate}
                        </p>
                     </div>
                     <div>
                        <p className="text-[#797b7d] text-xs font-semibold uppercase">
                           City
                        </p>
                        <p className="text-white font-semibold">
                           {cities.find((c) => c.id === selectedCity)?.name}
                        </p>
                     </div>
                     <div>
                        <p className="text-[#797b7d] text-xs font-semibold uppercase">
                           Format
                        </p>
                        <p className="text-white font-semibold">
                           {formats.find((f) => f.id === selectedFormat)?.name}
                        </p>
                     </div>
                     <div>
                        <p className="text-[#797b7d] text-xs font-semibold uppercase">
                           Theater & Time
                        </p>
                        <p className="text-white font-semibold">
                           {selectedShowtime.theater.name} -{" "}
                           {selectedShowtime.showtime.time}
                        </p>
                     </div>
                  </div>

                  <button className="mt-6 w-full bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold py-3 rounded-lg transition-colors">
                     Proceed to Seat Selection
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}
