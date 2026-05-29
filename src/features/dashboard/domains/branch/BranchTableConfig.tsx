import React from "react";
import {
   MapPin,
   User,
   Calendar,
   Edit2,
   Trash2,
   Layers,
   Eye,
   EllipsisVertical,
} from "lucide-react";
import type { Branch } from "@/types/branch";
import type {
   Column,
   FilterField,
} from "@/features/dashboard/shared/DashboardEntityList";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const getBranchColumns = (handlers: {
   onEdit: (branch: Branch) => void;
   onDelete: (id: string) => void;
   onViewDetail: (id: string) => void;
   onViewRooms: (id: string) => void;
   permissions: { canDelete: boolean; canUpdate: boolean };
}): Column<Branch>[] => [
   {
      id: "name",
      label: "Chi nhánh",
      render: (branch) => (
         <div>
            <div className="text-white text-sm font-semibold">
               {branch.name}
            </div>
            <div className="text-[#797b7d] text-[11px] flex items-center gap-1">
               <MapPin size={10} /> {branch.address}
            </div>
         </div>
      ),
   },
   {
      id: "city",
      label: "Thành phố",
      render: (branch) => (
         <span className="text-[#d1d5dc] text-xs font-medium bg-white/5 px-2 py-1 rounded">
            {branch.cityId} {/* Trong thực tế nên map với City Name */}
         </span>
      ),
   },
   {
      id: "manager",
      label: "Quản lý",
      render: (branch) => (
         <div className="flex items-center gap-2 text-[#d1d5dc] text-xs">
            <User size={12} className="text-rose-500" />
            {branch.managerId || "Chưa gán"}
         </div>
      ),
   },
   {
      id: "createTime",
      label: "Ngày tạo",
      render: (branch) => (
         <div className="text-[#797b7d] text-xs flex items-center gap-1.5">
            <Calendar size={12} />
            {new Date(branch.createTime).toLocaleDateString()}
         </div>
      ),
   },
   {
      id: "actions",
      label: "Hành động",
      align: "right",
      render: (branch) => (
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
               <DropdownMenuItem
                  onClick={() => handlers.onViewDetail(branch.id)}
               >
                  <Eye size={14} className="mr-2 text-green-400" /> Chi tiết
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => handlers.onViewRooms(branch.id)}
               >
                  <Layers size={14} className="mr-2 text-rose-400" /> Xem phòng
               </DropdownMenuItem>
               {handlers.permissions.canUpdate && (
                  <DropdownMenuItem onClick={() => handlers.onEdit(branch)}>
                     <Edit2 size={14} className="mr-2 text-blue-400" /> Chỉnh
                     sửa
                  </DropdownMenuItem>
               )}
               {handlers.permissions.canDelete && (
                  <DropdownMenuItem
                     onClick={() => handlers.onDelete(branch.id)}
                     className="text-red-400"
                  >
                     <Trash2 size={14} className="mr-2" /> Xóa
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];

export const getBranchFilters = (): FilterField[] => [
   {
      name: "name",
      label: "Tên chi nhánh",
      type: "text",
      placeholder: "Tìm tên...",
   },
   {
      name: "cityId",
      label: "Thành phố",
      type: "select",
      options: [], // Sẽ được fetch từ API City
      placeholder: "Tất cả thành phố",
   },
];
