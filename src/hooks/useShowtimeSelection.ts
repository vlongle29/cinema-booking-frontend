import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { showtimeService } from "../services/showtimeService";
import type { DateOption, City, Format, Showtime, Theater, ApiState } from "../types/showtime";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useShowtimeSelection = () => {
 // State management
   const { id: paramMovieId } = useParams<{ id: string }>();
   const [searchParams] = useSearchParams();
   const movieId = paramMovieId || searchParams.get("movieId") || "";
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
         // if (!movieId) return;
         
         try {
            await delay(800); // Artificial delay to show loading state
            const response: any = await showtimeService.getAvailableDate(movieId);
            const data: string[] = response.data;
            if (data && data.length > 0) {
               const formattedDates: DateOption[] = data.map((dateStr) => {
                  const dateObj = new Date(dateStr);
                  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                  return {
                     date: dateStr,
                     day: days[dateObj.getDay()],
                     dateNum: dateObj.getDate(),
                     fullDate: dateObj.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                     }),
                  };
               });
               setDates(formattedDates);
               setSelectedDate(formattedDates[0].date);
            } else {
               setDates([]);
               setSelectedDate("");
            }
            setDatesApi({ loading: false, error: null });
         } catch (error: any) {
            setDatesApi({
               loading: false,
               error: error.message || "Failed to load dates. Please try again.",
            });
         }
      };

      loadDates();
   }, [movieId]);

   // Step 1: When date changes, fetch cities
   useEffect(() => {
      if (!selectedDate || !movieId) return;

      const loadCities = async () => {
         setCitiesApi({ loading: true, error: null });
         setSelectedCity(""); // Reset city selection
         setFormats([]);
         setSelectedFormat("");
         setTheaters([]);

         try {
            await delay(800); // Artificial delay
            const response: any = await showtimeService.getAvailableCity(movieId, selectedDate);
            setCities(response.data);
            setCitiesApi({ loading: false, error: null });
         } catch (error: any) {
            setCitiesApi({
               loading: false,
               error: error.message || "Failed to load cities. Please try again.",
            });
         }
      };

      loadCities();
   }, [selectedDate, movieId]);

   // Step 2: When city changes, fetch formats
   useEffect(() => {
      if (!selectedCity || !selectedDate || !movieId) return;

      const loadFormats = async () => {
         setFormatsApi({ loading: true, error: null });
         setSelectedFormat(""); // Reset format selection
         setTheaters([]);

         try {
            await delay(800); // Artificial delay
            const response: any = await showtimeService.getAvailableFormat(movieId, selectedDate, selectedCity);
            const data: any[] = response.data || [];
            
            const formattedFormats: Format[] = data.map((item) => ({
               id: item.format,
               name: item.displayName,
               badge: item.format.includes('IMAX') ? 'Premium' : (item.format.includes('4DX') ? 'Experience' : 'Standard')
            }));
            
            setFormats(formattedFormats);
            setFormatsApi({ loading: false, error: null });
         } catch (error: any) {
            setFormatsApi({
               loading: false,
               error: error.message || "Failed to load formats. Please try again.",
            });
         }
      };

      loadFormats();
   }, [selectedCity, selectedDate, movieId]);

   // Step 3: When format changes, fetch theaters
   useEffect(() => {
      if (!selectedFormat || !selectedCity || !selectedDate || !movieId) return;

      const loadTheaters = async () => {
         setTheatersApi({ loading: true, error: null });
         setSelectedShowtime(null);

         try {
            await delay(800); // Artificial delay
            const response: any = await showtimeService.getAvailableShowtimes(
               movieId,
               selectedDate,
               selectedCity,
               selectedFormat,
            );
            
            const data: any[] = response.data || [];
            const mappedTheaters: Theater[] = data.map((branch) => {
               // Map each showtime within the branch
               const mappedShowtimes: Showtime[] = (branch.showtimes || []).map((st: any) => {
                  const startTime = new Date(st.startTime);
                  
                  // Format time to e.g. "02:52 PM"
                  const timeStr = startTime.toLocaleTimeString("en-US", {
                     hour: '2-digit',
                     minute: '2-digit',
                     hour12: true
                  });
                  
                  // Simple check for peak hours (e.g. after 5 PM)
                  const isPeakHour = startTime.getHours() >= 17;
                  
                  return {
                     id: st.showtimeId,
                     time: timeStr,
                     isPeak: isPeakHour,
                     isSoldOut: st.availableSeats <= 0,
                     availableSeats: st.availableSeats,
                  };
               });
               
               // Find city name for location
               const cityObj = cities.find(c => c.id === selectedCity);
               
               return {
                  id: branch.branchId,
                  name: branch.branchName,
                  location: cityObj ? cityObj.name : "Local",
                  showtimes: mappedShowtimes,
               };
            });
            
            setTheaters(mappedTheaters);
            setTheatersApi({ loading: false, error: null });
         } catch (error: any) {
            setTheatersApi({
               loading: false,
               error: error.message || "Failed to load theaters. Please try again.",
            });
         }
      };

      loadTheaters();
   }, [selectedFormat, selectedCity, selectedDate, movieId]);

   return {
      movieId,
      dates, selectedDate, setSelectedDate, datesApi,
      cities, selectedCity, setSelectedCity, citiesApi,
      formats, selectedFormat, setSelectedFormat, formatsApi,
      theaters, theatersApi,
      selectedShowtime, setSelectedShowtime
   };
}

export default useShowtimeSelection;