import React from "react";
import {
   MapPin,
   Edit2,
   Trash2,
   EllipsisVertical,
   Hash,
} from "lucide-react";
import type { City } from "@/types/city";
import type { Column } from "@/features/dashboard/shared/DashboardEntityList";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const getCityColumns = (handlers: {
   onEdit: (city: City) => void;
   onDelete: (id: string) => void;
   permissions: { canDelete: boolean; canUpdate: boolean };
}): Column<City>[] => [
   {
      id: "name",
      label: "Thành phố",
      render: (city) => (
         <div className="flex items-center gap-2">
            <MapPin size={14} className="text-rose-500 shrink-0" />
            <span className="text-white text-sm font-semibold whitespace-nowrap">{city.name}</span>
         </div>
      ),
   },
   {
      id: "code",
      label: "Mã thành phố",
      render: (city) => (
         <div className="flex items-center gap-1.5 text-[#d1d5dc] text-xs">
            <Hash size={12} className="text-rose-400" />
            <span className="font-medium bg-white/5 px-2 py-1 rounded tracking-wide uppercase">
               {city.code || "—"}
            </span>
         </div>
      ),
   },
   {
      id: "actions",
      label: "Hành động",
      align: "right",
      render: (city) => (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#797b7d]"
               >
                  <EllipsisVertical size={18} />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               align="end"
               className="bg-[#1a1a1e] border-white/10 text-gray-300"
            >
               {handlers.permissions.canUpdate && (
                  <DropdownMenuItem
                     onClick={() => handlers.onEdit(city)}
                     className="cursor-pointer"
                  >
                     <Edit2 size={14} className="mr-2 text-blue-400" /> Chỉnh sửa
                  </DropdownMenuItem>
               )}
               {handlers.permissions.canDelete && (
                  <DropdownMenuItem
                     onClick={() => handlers.onDelete(city.id)}
                     className="text-red-400 cursor-pointer"
                  >
                     <Trash2 size={14} className="mr-2" /> Xóa
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];
