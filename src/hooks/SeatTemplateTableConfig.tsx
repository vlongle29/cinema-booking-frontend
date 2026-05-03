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
      label: "Template Name",
      render: (template) => (
         <div className="flex flex-col">
            <p className="text-white text-sm font-semibold hover:text-[#f84565] transition-colors">
               {template.name}
            </p>
            <p className="text-[#797b7d] text-[11px] mt-1 line-clamp-2">
               {template.description || "No description"}
            </p>
         </div>
      ),
   },
   {
      id: "layout",
      label: "Layout",
      render: (template) => (
         <div className="text-white text-sm font-medium">
            {template.rows} R x {template.columns} C
         </div>
      ),
   },
   {
      id: "capacity",
      label: "Capacity",
      render: (template) => (
         <div className="text-white text-sm font-medium">
            {template.totalSeats} Seats
         </div>
      ),
   },
   {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (template) => (
         <div className="flex justify-end gap-2">
            <button
               onClick={() => onApply(template)}
               className="p-2 text-[#797b7d] hover:text-[#f84565] hover:bg-[#f84565]/10 rounded-lg transition-all"
               title="Apply template to room"
            >
               <FiCheckSquare size={16} />
            </button>
            <button
               onClick={() => onEdit(template)}
               className="p-2 text-[#797b7d] hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
               title="Edit template layout"
            >
               <FiEdit2 size={16} />
            </button>
            <button
               onClick={() => onDelete(template.id)}
               className="p-2 text-[#797b7d] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
               title="Delete template"
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
      label: "Keyword",
      type: "text",
      placeholder: "Template name or description...",
   },
];
