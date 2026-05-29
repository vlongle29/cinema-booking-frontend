import React from "react";

interface StatusBadgeProps {
   status: string; // "0" = Active, "1" = Locked
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
   const isActive = status === "0";
   return (
      <span
         className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isActive
               ? "bg-emerald-50 text-emerald-700 border-emerald-100"
               : "bg-rose-50 text-rose-700 border-rose-100"
         }`}
      >
         {isActive ? "Đang hoạt động" : "Đã khóa"}
      </span>
   );
};

export default StatusBadge;
