import React from "react";
import { useMyBookings, BookingHistoryCard } from "@/features/booking/index";

const MyBookingPage: React.FC = () => {
   const { bookings, isLoading } = useMyBookings();

   return (
      <div className="mt-16 bg-[#09090b] min-h-screen text-gray-200">
         <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-300 mb-8">
               Lịch sử đặt vé
            </h1>

            {/* Xử lý loading và rỗng */}
            {isLoading && <p>Đang tải lịch sử...</p>}

            {!isLoading && bookings.length === 0 && <p>Bạn chưa có vé nào.</p>}

            {/* Render List */}
            <div className="flex flex-col gap-8">
               {bookings.map((booking) => (
                  <BookingHistoryCard key={booking.id} booking={booking} />
               ))}
            </div>
         </div>
      </div>
   );
};

export default MyBookingPage;
