import React from "react";

interface RoleBadgeProps {
   name: string;
   code?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ name, code }) => {
   const getColor = (roleCode: string = "") => {
      switch (roleCode.toUpperCase()) {
         case "ADMIN":
         case "SUPER_ADMIN":
            return "bg-rose-50 text-rose-600 border-rose-100";
         case "STAFF":
         case "EMPLOYEE":
            return "bg-blue-50 text-blue-600 border-blue-100";
         default:
            return "bg-slate-50 text-slate-600 border-slate-100";
      }
   };

   return (
      <span
         className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-tight ${getColor(code)}`}
      >
         {name}
      </span>
   );
};

export default RoleBadge;
