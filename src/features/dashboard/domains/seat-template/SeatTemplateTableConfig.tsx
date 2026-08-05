import React from "react";
import { FiEdit2, FiTrash2, FiCheckSquare } from "react-icons/fi";
import type { Column, FilterField } from "../DashboardEntityList";

interface SeatTemplate {
   id: string;
   name: string;
   description: string;
   rows: number;
   columns: number;
   totalSeats: number;
}

export const getSeatTemplateColumns = (
   onEdit: (template: SeatTemplate) => void,
   onDelete: (id: string) => void,
   onApply: (template: SeatTemplate) => void,
): Column<SeatTemplate>[] => [
   {
      id: "name",
      label: "Tên sơ đồ",
      render: (template) => (
         <div className="flex flex-col">
            <p className="text-white text-sm font-semibold hover:text-[#f84565] transition-colors">
               {template.name}
            </p>
            <p className="text-[#797b7d] text-[11px] mt-1 line-clamp-2">
               {template.description || "Không có mô tả"}
            </p>
         </div>
      ),
   },
   {
      id: "layout",
      label: "Bố cục",
      render: (template) => (
         <div className="text-white text-sm font-medium">
            {template.rows} Hàng x {template.columns} Cột
         </div>
      ),
   },
   {
      id: "capacity",
      label: "Sức chứa",
      render: (template) => (
         <div className="text-white text-sm font-medium">
            {template.totalSeats} Ghế
         </div>
      ),
   },
   {
      id: "actions",
      label: "Thao tác",
      align: "right",
      render: (template) => (
         <div className="flex justify-end gap-2">
            <button
               onClick={() => onApply(template)}
               className="p-2 text-[#797b7d] hover:text-[#f84565] hover:bg-[#f84565]/10 rounded-lg transition-all"
               title="Áp dụng sơ đồ vào phòng"
            >
               <FiCheckSquare size={16} />
            </button>
            <button
               onClick={() => onEdit(template)}
               className="p-2 text-[#797b7d] hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
               title="Chỉnh sửa sơ đồ"
            >
               <FiEdit2 size={16} />
            </button>
            <button
               onClick={() => onDelete(template.id)}
               className="p-2 text-[#797b7d] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
               title="Xóa sơ đồ"
            >
               <FiTrash2 size={16} />
            </button>
         </div>
      ),
   },
];

export const getSeatTemplateFilters = (): FilterField[] => [
   {
      name: "keyword",
      label: "Từ khóa",
      type: "text",
      placeholder: "Tìm tên hoặc mô tả sơ đồ...",
   },
];
