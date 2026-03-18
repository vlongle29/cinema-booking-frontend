// src/components/dashboard/showtime/showtimeTableConfig.tsx
import React from "react";
import { Calendar, Clock, Monitor, Trash2 } from "lucide-react";
import type { Showtime } from "../../../types/showtime";
import type { Column, FilterField } from "../DashboardEntityList";

// Hàm trả về mảng columns, nhận vào hàm xử lý delete để gắn vào nút Trash2
export const getShowtimeColumns = (onDelete: (id: string) => void): Column<Showtime>[] => [
      {
         id: "movie",
         label: "Movie",
         render: (show) => (
            <div className="flex items-center gap-4">
               <div className="w-12 h-16 rounded-[4px] bg-[#252529] flex-shrink-0 overflow-hidden border border-[#393939]">
                  <img 
                     src={show.movie?.posterUrl || ""} 
                     alt={show.movie?.title || "Unknown Movie"}
                     className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                     onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150x220?text=No+Poster";
                     }}
                  />
               </div>
               <div className="max-w-[150px]">
                  <p className="text-white text-sm font-semibold truncate hover:text-[#f84565] transition-colors">
                     {show.movie?.title || "Movie Deleted"}
                  </p>
                  <p className="text-[#797b7d] text-[11px] mt-1">
                     {show.movie ? `${show.movie.durationMinutes} mins | ${show.movie.rated}` : "N/A"}
                  </p>
               </div>
            </div>
         )
      },
      {
         id: "branch",
         label: "Branch & Room",
         render: (show) => (
            <div>
               <div className="text-white text-sm font-medium">{show.branch.name}</div>
               <div className="text-[#797b7d] text-[11px] mt-1 flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  {show.room.name}
               </div>
            </div>
         )
      },
      {
         id: "time",
         label: "Time",
         render: (show) => (
            <div className="flex flex-col">
               <div className="text-white text-sm font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#f84565]" />
                  {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </div>
               <div className="text-[#797b7d] text-[11px] mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(show.startTime).toLocaleDateString('vi-VN')}
               </div>
            </div>
         )
      },
      {
         id: "format",
         label: "Format",
         render: (show) => (
            <span className="px-2 py-1 bg-[#f84565]/10 text-[#f84565] border border-[#f84565]/20 rounded text-[10px] font-black uppercase tracking-tighter">
               {show.format.replace('_', ' ')}
            </span>
         )
      },
      {
         id: "price",
         label: "Price",
         render: (show) => (
            <div className="text-white text-sm font-bold">
               {show.price.toLocaleString('vi-VN')}đ
            </div>
         )
      },
      {
         id: "status",
         label: "Status",
         render: (show) => (
            <span className={`px-2 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
               show.status === 'OPEN' 
               ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
               : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
               {show.status}
            </span>
         )
      },
   {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (show) => (
         <button 
            className="p-2 text-[#797b7d] hover:text-[#f84565] hover:bg-[#f84565]/10 rounded-lg transition-all"
            title="Delete showtime"
            onClick={() => onDelete(show.id)}
         >
            <Trash2 className="w-4 h-4" />
         </button>
      )
   }
];

// Hàm trả về mảng filters, nhận vào options và searchParams để binding dữ liệu
export const getShowtimeFilters = (options: any, searchParams: any): FilterField[] => [
   {
      name: "movieId",
      label: "Movie",
      type: "select",
      options: options.movies.map((m: any) => ({ value: m.id, label: m.title })),
      placeholder: "All Movies"
   },
      {
         name: "cityId",
         label: "City",
         type: "select",
         options: options.cities.map((c: any) => ({ value: c.id, label: c.name })),
         placeholder: "All Cities"
      },
      {
         name: "branchId",
         label: "Branch",
         type: "select",
         disabled: !searchParams.cityId,
         options: options.branch.map((b: any) => ({ value: b.id, label: b.name })),
         placeholder: "All Branches"
      },
      {
         name: "roomId",
         label: "Room",
         type: "select",
         disabled: !searchParams.branchId,
         options: options.rooms.map((r: any) => ({ value: r.id, label: r.name })),
         placeholder: "All Rooms"
      },
      {
         name: "date",
         label: "Date",
         type: "date"
      },
      {
         name: "format",
         label: "Format",
         type: "select",
         options: options.formats.map((f: any) => ({ value: f.format, label: f.displayName })),
         placeholder: "All Formats"
      }
]; 