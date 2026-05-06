import React, { useEffect, useState } from "react";
import { bookingService } from "@/services/bookingService";
import type { BookingListItem } from "@/types/booking";
import { API_BASE_URL } from "@/constants/api";

const MyBookingPage: React.FC = () => {
   const [bookings, setBookings] = useState<BookingListItem[]>([]);

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(amount);
   };

   useEffect(() => {
      // Fetch user's booking history from the backend
      const fetchBookings = async () => {
         try {
            const response = await bookingService.getMyBookings();
            console.log("User Bookings:", response.data);

            setBookings(response.data.content || []);
         } catch (error) {
            console.error("Failed to fetch user bookings:", error);
         }
      };

      fetchBookings();
   }, []);

   return (
      <div className="mt-16 bg-[#09090b] min-h-screen text-gray-200">
         <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-300 mb-8">
               Lịch sử đặt vé
            </h1>
            <div className="flex flex-col gap-8">
               {bookings
                  .filter((b) => b.status === "PAID")
                  .map((b) => (
                     <div
                        key={b.id}
                        className="flex items-center bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-lg p-6 gap-8"
                     >
                        <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                           <img
                              src={`${API_BASE_URL}${b.moviePosterUrl}`}
                              alt={b.movieTitle}
                              className="w-full h-full object-cover"
                           />
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start">
                              <h2 className="text-xl font-semibold text-white mb-2">
                                 {b.movieTitle}
                              </h2>
                              <span
                                 className={`text-xs px-2 py-1 rounded ${
                                    b.status === "PAID"
                                       ? "bg-green-500/20 text-green-500"
                                       : "bg-gray-500/20 text-gray-400"
                                 }`}
                              >
                                 {b.status}
                              </span>
                           </div>
                           <p className="text-sm text-gray-400 mb-1">
                              {b.branchName} - {b.roomName} ({b.cityName})
                           </p>
                           <p className="text-sm text-[#f84565] mb-2">
                              {new Date(b.showtimeStartTime).toLocaleString(
                                 "vi-VN",
                              )}
                           </p>
                           <div className="flex gap-6 mt-2 text-sm text-gray-400">
                              <div>
                                 Số vé:{" "}
                                 <span className="text-white font-medium">
                                    {b.ticketCount}
                                 </span>
                              </div>
                              <div>
                                 Ngày đặt:{" "}
                                 <span className="text-gray-500">
                                    {new Date(b.bookingDate).toLocaleDateString(
                                       "vi-VN",
                                    )}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right min-w-[80px]">
                           <p className="text-2xl font-bold text-white">
                              {formatCurrency(b.finalAmount)}
                           </p>
                        </div>
                     </div>
                  ))}
            </div>
         </div>
      </div>
   );
};

export default MyBookingPage;
