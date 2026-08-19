import React, { useEffect, useState, useMemo, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { seatService } from "../../../services/seatService";
import { showtimeService } from "../../../services/showtimeService";
import { SEAT_STATUS } from "../../../constants/websocketEvents";

// Imports từ các file đã tách
import { cn } from "../../../utils/utils";
import type { SeatStatus } from "../../../types/booking";
import { TICKET_PRICE } from "../../../constants/mockData";
import Seat from "../../../components/ui/Seat";
import { AuthContext } from "../../../context/AuthContext";
import { useBookingWebSocket } from "../../../hooks/useBookingWebSocket";
import { bookingService } from "../../../services/bookingService";

interface productItem {
   productId: string;
   priceAtPurchase: number;
   quantity: number;
}

interface bookingConfirmRequest {
   showtimeId: string;
   seatIds: string[];
   products: productItem[];
}

const SeatSelectPage: React.FC = () => {
   const navigate = useNavigate();
   const { id: showtimeId } = useParams<{ id: string }>();

   // Khởi tạo WebSocket hook với showtimeId và accessToken
   const { seatStatus } = useBookingWebSocket(showtimeId || "");

   // --- State Management ---
   const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
   const [seatLayout, setSeatLayout] = useState<any[]>([]);
   const [seatStatuses, setSeatStatuses] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      console.log("showtimeId", showtimeId);

      const loadData = async () => {
         if (!showtimeId) return;

         try {
            if (!showtimeId) return;
            setIsLoading(true);

            // 1. Lấy chi tiết suất chiếu để có roomId
            const showtimeRes =
               await showtimeService.getShowtimeById(showtimeId);
            const roomId = showtimeRes.data.roomId;

            // 2. Load Layout và Status song song
            const [layoutRes, statusRes] = await Promise.all([
               seatService.getSeatsByRoom(roomId),
               showtimeService.getAllSeatStatus(showtimeId),
            ]);

            if (layoutRes.data) setSeatLayout(layoutRes.data);
            if (statusRes.data?.seats) {
               setSeatStatuses(statusRes.data.seats);
            }
         } catch (error) {
            console.error("Failed to fetch seats:", error);
         } finally {
            setIsLoading(false);
         }
      };
      loadData();
   }, [showtimeId]);

   // --- 3. MERGE DATA SOURCES ---
   const mergedSeats = useMemo(() => {
      return seatLayout.map((seat: any) => {
         // Tìm trạng thái tương ứng từ showtime status API
         const statusInfo = seatStatuses.find((s: any) => s.seatId === seat.id);

         // Lấy trạng thái Real-time từ WebSocket
         const realTimeStatus = seatStatus[seat.id];
         // console.log(
         //    `Seat ${seat.seatNumber} - Real-time: ${realTimeStatus}, API: ${statusInfo?.status}`,
         // );

         // Ưu tiên Real-time -> API -> Available
         const finalStatus =
            realTimeStatus || statusInfo?.status || SEAT_STATUS.AVAILABLE;

         return {
            ...seat,
            currentStatus: finalStatus, // Quan trọng: Sử dụng finalStatus đã tính toán ở trên
            currentPrice:
               statusInfo?.price || seat.seatType?.basePrice || TICKET_PRICE,
            heldByBookingId: statusInfo?.heldByBookingId,
         };
      });
   }, [seatLayout, seatStatuses, seatStatus]);

   // --- TÍNH TOÁN MA TRẬN GRID (Sử dụng trực tiếp dữ liệu từ API) ---
   const maxCols =
      seatLayout.length > 0
         ? Math.max(...seatLayout.map((s: any) => s.columnIndex)) + 1
         : 10;

   const maxRows =
      seatLayout.length > 0
         ? Math.max(...seatLayout.map((s: any) => s.rowIndex)) + 1
         : 10;

   // --- Logic Handlers ---
   const toggleSeat = (seat: any) => {
      // Không cho chọn nếu ghế đã được đặt hoặc bị khóa bởi người khác
      if (
         seat.currentStatus === SEAT_STATUS.BOOKED ||
         seat.currentStatus === SEAT_STATUS.LOCKED ||
         seat.currentStatus === "HELD"
      ) {
         return;
      }

      const newSelected = new Set(selectedSeats);
      if (newSelected.has(seat.id)) {
         newSelected.delete(seat.id);
      } else {
         newSelected.add(seat.id);
      }
      setSelectedSeats(newSelected);
   };

   const getSeatStatus = (seat: any): SeatStatus => {
      if (selectedSeats.has(seat.id)) return "selected";
      if (
         seat.currentStatus === SEAT_STATUS.BOOKED ||
         seat.currentStatus === SEAT_STATUS.LOCKED ||
         seat.currentStatus === "HELD"
      ) {
         return "occupied";
      }
      return "available";
   };

   const handleCheckout = async () => {
      if (selectedSeats.size === 0) {
         alert("Vui lòng chọn ít nhất một ghế để tiếp tục.");
         return;
      }

      const seatIds = Array.from(selectedSeats);

      try {
         // 1. Gọi API xác nhận đặt ghế (cần await vì là thao tác mạng)
         const response = await bookingService.confirmBooking(
            showtimeId || "",
            seatIds,
            [], // Hiện tại chưa có sản phẩm nào được chọn
         );

         // Lấy danh sách seatNumber để hiển thị ở trang sau
         const seatNumbers = mergedSeats
            .filter((s) => selectedSeats.has(s.id))
            .map((s) => s.seatNumber);

         const totalPrice = response.data.tickets.reduce(
            (total: number, ticket: any) => total + ticket.price,
            0,
         );

         navigate("/checkout", {
            state: {
               showtimeId,
               seats: seatNumbers,
               timing: "",
               bookingId: response.data.id,
               ticketPrice: totalPrice,
               totalAmount: totalPrice,
               products: [], // Hiện tại chưa có sản phẩm nào được chọn
            },
         });
         console.log("Booking confirmation response:", response);
      } catch (error) {
         console.error("Lỗi khi tạo đơn hàng:", error);
         alert("Không thể đặt ghế lúc này. Vui lòng thử lại!");
      }
   };

   return (
      <div className="mt-16 min-h-screen bg-amber-50 text-slate-900 flex flex-col items-center relative overflow-hidden pb-32">
         {/* Background Ambience */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

         <div className="w-full max-w-6xl mx-auto px-4">
            {/* --- Section 1: Header & Screen --- */}
            <div className="mt-10 mb-8 flex flex-col items-center">
               <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                     Chọn <span className="text-amber-500">Ghế ngồi</span>
                  </h1>
               </div>
               <p className="text-sm text-slate-500 mb-8">Bấm vào ghế để chọn hoặc bỏ chọn</p>

               {/* Screen indicator */}
               <div className="relative w-full max-w-lg flex flex-col items-center mb-2">
                  <div className="w-3/4 h-14 border-t-4 border-amber-400/60 rounded-[50%] shadow-[0_-8px_24px_rgba(251,191,36,0.15)] relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent blur-sm" />
                  </div>
                  <span className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase mt-[-36px]">
                     Màn hình
                  </span>
               </div>
            </div>

            {/* --- Section 2: Seats Grid --- */}
            {isLoading ? (
               <div className="flex flex-col items-center gap-3 py-20">
                  <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-400 text-sm">Đang tải sơ đồ ghế...</span>
               </div>
            ) : (
               <div className="w-full overflow-x-auto py-6 sidebar-scroll">
                  <div
                     className="grid gap-2 sm:gap-2.5 w-max mx-auto"
                     style={{
                        gridTemplateColumns: `repeat(${maxCols}, minmax(36px, 40px))`,
                        gridTemplateRows: `repeat(${maxRows}, minmax(36px, 40px))`,
                     }}
                  >
                     {mergedSeats.map((seat: any) => (
                        <div
                           key={seat.id}
                           className="flex items-center justify-center"
                           style={{
                              gridRow: seat.rowIndex + 1,
                              gridColumn: (seat.columnIndex || 0) + 1,
                           }}
                        >
                           {!seat.isAisle ? (
                              <Seat
                                 id={seat.id}
                                 seatNumber={seat.seatNumber}
                                 label={seat.seatNumber}
                                 status={getSeatStatus(seat)}
                                 onClick={() => toggleSeat(seat)}
                              />
                           ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 opacity-0 pointer-events-none" />
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* --- Section 3: Legend --- */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs md:text-sm text-slate-500 font-medium">
               <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-slate-200 border border-slate-300" />
                  <span>Đã đặt</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md border-2 border-amber-400 bg-transparent" />
                  <span>Trống</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  <span>Đang chọn</span>
               </div>
            </div>
         </div>

         {/* --- Section 4: Checkout Bar --- */}
         <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg p-4 z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
               <div className="flex flex-col">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                     Ghế đã chọn
                  </span>
                  <span className="text-slate-800 font-bold text-lg leading-tight">
                     {selectedSeats.size > 0
                        ? mergedSeats
                             .filter((s) => selectedSeats.has(s.id))
                             .map((s) => s.seatNumber)
                             .sort()
                             .join(", ")
                        : "Chưa chọn ghế"}
                  </span>
               </div>

               <button
                  onClick={handleCheckout}
                  disabled={selectedSeats.size === 0}
                  className={cn(
                     "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all duration-300 text-sm",
                     selectedSeats.size > 0
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-400/30 hover:scale-105 active:scale-95 hover:shadow-amber-400/50"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed",
                  )}
               >
                  Tiếp tục thanh toán
                  <ArrowRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default SeatSelectPage;
