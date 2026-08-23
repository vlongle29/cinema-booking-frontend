// src/components/dashboard/showtime/showtimeTableConfig.tsx
import React from "react";
import {
   Calendar,
   Clock,
   Monitor,
   Trash2,
   Edit2,
   EllipsisVertical,
   Film,
} from "lucide-react";
import type { Showtime } from "../../../showtime/types/showtime.types";
import type { Column, FilterField } from "../../shared/DashboardEntityList";
import { API_BASE_URL } from "../../../../constants/api";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ShowtimeMovieCell: React.FC<{ movie?: Showtime["movie"] }> = ({ movie }) => {
   const [imgError, setImgError] = React.useState(false);
   const posterUrl = movie?.posterUrl
      ? movie.posterUrl.startsWith("http")
         ? movie.posterUrl
         : `${API_BASE_URL}${movie.posterUrl.startsWith("/") ? "" : "/"}${movie.posterUrl}`
      : null;

   const isMovieAvailable = Boolean(movie && movie.title);

   return (
      <div className="flex items-center gap-3.5">
         <div className="w-12 h-16 rounded-[6px] bg-[#1a1a1e] flex-shrink-0 overflow-hidden border border-[#2e2e34] flex items-center justify-center relative shadow-sm group">
            {posterUrl && !imgError ? (
               <img
                  src={posterUrl}
                  alt={movie?.title || "Phim"}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
               />
            ) : (
               <div className="flex flex-col items-center justify-center w-full h-full bg-[#18181c] text-[#55575e] p-1 text-center select-none">
                  <Film className="w-5 h-5 text-[#52525b] mb-1" />
                  <span className="text-[8px] font-semibold text-[#71717a] uppercase tracking-wider leading-none">
                     No Poster
                  </span>
               </div>
            )}
         </div>
         <div className="max-w-[160px]">
            {isMovieAvailable ? (
               <>
                  <p
                     className="text-white text-sm font-semibold truncate hover:text-[#f84565] transition-colors"
                     title={movie?.title}
                  >
                     {movie?.title}
                  </p>
                  <p className="text-[#797b7d] text-[11px] mt-1 truncate">
                     {movie?.durationMinutes ? `${movie.durationMinutes} phút` : ""} {movie?.rated ? `| ${movie.rated}` : ""}
                  </p>
               </>
            ) : (
               <>
                  <p className="text-zinc-400 text-xs font-semibold flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 inline-block" />
                     Phim đã gỡ
                  </p>
                  <p className="text-[#52525b] text-[11px] mt-0.5">
                     Không có thông tin
                  </p>
               </>
            )}
         </div>
      </div>
   );
};

// Hàm trả về mảng columns, nhận vào hàm xử lý delete để gắn vào nút Trash2
export const getShowtimeColumns = (handlers: {
   onEdit: (show: Showtime) => void;
   onDelete: (id: string) => void;
}): Column<Showtime>[] => [
   {
      id: "movie",
      label: "Phim",
      render: (show) => <ShowtimeMovieCell movie={show.movie} />,
   },
   {
      id: "branch",
      label: "CHi nhánh & Phòng",
      render: (show) => (
         <div>
            <div className="text-white text-sm font-medium">
               {show.branch.name}
            </div>
            <div className="text-[#797b7d] text-[11px] mt-1 flex items-center gap-1">
               <Monitor className="w-3 h-3" />
               {show.room.name}
            </div>
         </div>
      ),
   },
   {
      id: "time",
      label: "Thời gian",
      render: (show) => (
         <div className="flex flex-col">
            <div className="text-white text-sm font-semibold flex items-center gap-1.5">
               <Clock className="w-3.5 h-3.5 text-[#f84565]" />
               {new Date(show.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
               })}
            </div>
            <div className="text-[#797b7d] text-[11px] mt-1 flex items-center gap-1.5">
               <Calendar className="w-3.5 h-3.5" />
               {new Date(show.startTime).toLocaleDateString("vi-VN")}
            </div>
         </div>
      ),
   },
   {
      id: "format",
      label: "Định dạng",
      render: (show) => (
         <span className="px-2 py-1 bg-[#f84565]/10 text-[#f84565] border border-[#f84565]/20 rounded text-[10px] font-black uppercase tracking-tighter">
            {show.format.replace("_", " ")}
         </span>
      ),
   },
   {
      id: "price",
      label: "Giá",
      render: (show) => (
         <div className="text-white text-sm font-bold">
            {show.price.toLocaleString("vi-VN")}đ
         </div>
      ),
   },
   {
      id: "status",
      label: "Tình trạng",
      render: (show) => {
         const isClosed = show.status === "CLOSED";
         const isOpen = show.status === "OPEN";
         return (
            <span
               className={`inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                  isOpen
                     ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                     : "bg-zinc-500/15 text-zinc-400 border border-zinc-600/30"
               }`}
            >
               <span
                  className={`w-1.5 h-1.5 rounded-full ${
                     isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
                  }`}
               />
               {isOpen ? "Đang mở" : isClosed ? "Đã đóng" : show.status}
            </span>
         );
      },
   },
   {
      id: "actions",
      label: "Hành động",
      align: "right",
      render: (show) => (
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
                  onClick={() => handlers.onEdit(show)}
                  className="cursor-pointer hover:bg-white/5"
               >
                  <Edit2 size={14} className="mr-2 text-blue-400" />
                  <span>Sửa suất chiếu</span>
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => handlers.onDelete(show.id)}
                  className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
               >
                  <Trash2 size={14} className="mr-2" />
                  <span>Xóa suất chiếu</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];

// Hàm trả về mảng filters, nhận vào options và searchParams để binding dữ liệu
export const getShowtimeFilters = (
   options: any,
   searchParams: any,
): FilterField[] => [
   {
      name: "movieId",
      label: "Phim",
      type: "select",
      options: options.movies.map((m: any) => ({
         value: m.id,
         label: m.title,
      })),
      placeholder: "Tất cả phim",
   },
   {
      name: "cityId",
      label: "Thành phố",
      type: "select",
      options: options.cities.map((c: any) => ({ value: c.id, label: c.name })),
      placeholder: "Tất cả thành phố",
   },
   {
      name: "branchId",
      label: "Chi nhánh",
      type: "select",
      disabled: !searchParams.cityId,
      options: options.branch.map((b: any) => ({ value: b.id, label: b.name })),
      placeholder: "Tất cả chi nhánh",
   },
   {
      name: "roomId",
      label: "Phòng",
      type: "select",
      disabled: !searchParams.branchId,
      options: options.rooms.map((r: any) => ({ value: r.id, label: r.name })),
      placeholder: "Tất cả phòng",
   },
   {
      name: "date",
      label: "Ngày chiếu",
      type: "date",
   },
   {
      name: "format",
      label: "Định dạng",
      type: "select",
      options: options.formats.map((f: any) => ({
         value: f.format,
         label: f.displayName,
      })),
      placeholder: "Tất cả định dạng",
   },
];
