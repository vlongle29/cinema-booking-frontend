import React from "react";
import {
   Calendar,
   Monitor,
   Trash2,
   Edit2,
   EllipsisVertical,
} from "lucide-react";
import type { Movie } from "@/types/movie"; // Updated path
import type {
   Column,
   FilterField,
} from "@/features/dashboard/shared/DashboardEntityList";
import { API_BASE_URL } from "@/constants/api"; // Updated path
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const MOVIE_STATUS_TRANSLATION: Record<string, string> = {
   SHOWING: "ĐANG CHIẾU",
   COMING_SOON: "SẮP CHIẾU",
   ENDED: "ĐÃ KẾT THÚC",
   END: "ĐÃ KẾT THÚC",
};

export const getMovieColumns = (handlers: {
   onEdit: (movie: Movie) => void;
   onDelete: (id: string) => void;
}): Column<Movie>[] => [
   {
      id: "movie",
      label: "Phim",
      render: (movie) => (
         <div className="flex items-center gap-4">
            <div className="w-16 h-24 rounded-[4px] bg-[#252529] flex-shrink-0 overflow-hidden border border-[#393939]">
               <img
                  src={`${API_BASE_URL}${movie.posterUrl}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
               />
            </div>
            <div className="max-w-[200px]">
               <p className="text-white text-sm font-semibold truncate hover:text-[#f84565] transition-colors">
                  {movie.title}
               </p>
               <p className="text-[#797b7d] text-[11px] mt-1">
                  {movie.durationMinutes} mins | {movie.rated}
               </p>
            </div>
         </div>
      ),
   },
   {
      id: "director",
      label: "Đạo diễn & Diễn viên",
      render: (movie) => (
         <div>
            <div className="text-white text-sm font-medium">
               {movie.director}
            </div>
            <div
               className="text-[#797b7d] text-[11px] mt-1 truncate max-w-[200px]"
               title={movie.cast}
            >
               {movie.cast}
            </div>
         </div>
      ),
   },
   {
      id: "details",
      label: "Chi tiết",
      render: (movie) => (
         <div className="flex flex-col gap-1">
            <div className="text-[#d1d5dc] text-xs flex items-center gap-1.5">
               <Calendar className="w-3 h-3 text-[#f84565]" />
               {new Date(movie.releaseDate).toLocaleDateString()}
            </div>
            <div className="text-[#797b7d] text-[11px] flex items-center gap-1.5">
               <Monitor className="w-3 h-3" /> {movie.language}
            </div>
         </div>
      ),
   },
   {
      id: "status",
      label: "Trạng thái",
      render: (movie) => {
         const status = movie.status || "";
         const label = MOVIE_STATUS_TRANSLATION[status] || status.replace("_", " ");
         return (
            <span
               className={`px-2 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                  status === "SHOWING"
                     ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                     : status === "COMING_SOON"
                       ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                       : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
               }`}
            >
               {label}
            </span>
         );
      },
   },
   {
      id: "actions",
      label: "Thao tác",
      align: "right",
      render: (movie) => (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#797b7d] hover:text-[#f84565]"
               >
                  <EllipsisVertical size={18} />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               align="end"
               className="w-40 bg-[#1a1a1e] border-white/10 text-gray-300"
            >
               <DropdownMenuItem
                  onClick={() => handlers.onEdit(movie)}
                  className="cursor-pointer hover:bg-white/5"
               >
                  <Edit2 size={14} className="mr-2 text-blue-400" />
                  <span>Sửa thông tin</span>
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => handlers.onDelete(movie.id)}
                  className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
               >
                  <Trash2 size={14} className="mr-2" />
                  <span>Xóa phim</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];

export const getMovieFilters = (): FilterField[] => [
   {
      name: "keyword",
      label: "Từ khóa",
      type: "text",
      placeholder: "Tên phim, đạo diễn...",
   },
   {
      name: "status",
      label: "Trạng thái",
      type: "select",
      options: [
         { value: "SHOWING", label: "Đang chiếu" },
         { value: "COMING_SOON", label: "Sắp chiếu" },
         { value: "ENDED", label: "Đã kết thúc (ENDED)" },
         { value: "END", label: "Đã kết thúc (END)" },
      ],
      placeholder: "Tất cả trạng thái",
   },
   {
      name: "releaseDateFrom",
      label: "Từ ngày",
      type: "date",
   },
   {
      name: "releaseDateTo",
      label: "Đến ngày",
      type: "date",
   },
];
