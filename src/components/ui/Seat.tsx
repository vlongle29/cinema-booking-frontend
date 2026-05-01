import React from "react";
import { cn } from "../../lib/utils";

// Giữ nguyên interface của bạn
interface SeatProps {
   id: string;
   seatNumber: string;
   label: string;
   status: "available" | "selected" | "occupied";
   onClick: () => void; // Định nghĩa lại cho rõ: hàm không cần nhận tham số
}

const Seat: React.FC<SeatProps> = ({ id, seatNumber, label, status, onClick }) => {
   const baseStyles =
      "w-10 h-8 md:w-11 md:h-9 rounded-md flex items-center justify-center text-[10px] md:text-xs font-medium transition-all duration-200 select-none cursor-pointer border";

   const styles = {
      available:
         "border-gray-700 text-gray-400 bg-transparent hover:border-rose-500 hover:text-rose-400",
      selected:
         "bg-rose-600 border-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.6)] transform scale-105",
      occupied:
         "bg-gray-800 border-gray-800 text-gray-600 cursor-not-allowed opacity-50",
   };

   return (
      <button
         // Đã sửa onClick(id) thành onClick()
         onClick={() => status !== "occupied" && onClick()}
         disabled={status === "occupied"}
         className={cn(baseStyles, styles[status])}
         title={
            status === "occupied" ? "Seat Occupied" : `Select seat ${label}`
         }
      >
         {label}
      </button>
   );
};

// Sử dụng React.memo để chặn re-render thừa
export default React.memo(Seat);