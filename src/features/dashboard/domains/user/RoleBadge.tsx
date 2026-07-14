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
         case "MANAGER":
            return "bg-purple-50 text-purple-600 border-purple-100";
         case "CUSTOMER":
            return "bg-emerald-50 text-emerald-600 border-emerald-100";
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
