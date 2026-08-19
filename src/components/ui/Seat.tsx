import React from "react";
import { cn } from "../../utils/utils";

// Giữ nguyên interface của bạn
interface SeatProps {
   id: string;
   seatNumber: string;
   label: string;
   status: "available" | "selected" | "occupied";
   onClick: () => void; // Định nghĩa lại cho rõ: hàm không cần nhận tham số
}

const Seat: React.FC<SeatProps> = ({
   id,
   seatNumber,
   label,
   status,
   onClick,
}) => {
   const baseStyles =
      "w-10 h-8 md:w-11 md:h-9 rounded-md flex items-center justify-center text-[10px] md:text-xs font-medium transition-all duration-200 select-none cursor-pointer border";

   const styles = {
      available:
         "border-slate-400 text-slate-600 bg-white hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50 font-semibold",
      selected:
         "bg-amber-400 border-amber-400 text-white shadow-[0_0_12px_rgba(251,191,36,0.5)] transform scale-105",
      occupied:
         "bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed opacity-60",
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
