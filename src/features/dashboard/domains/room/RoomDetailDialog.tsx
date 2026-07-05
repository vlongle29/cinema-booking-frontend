import React, { useEffect, useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Building2,
   Clock,
   Users,
   Calendar,
   Layers,
   Info,
   Armchair,
   AlertCircle,
   Loader2,
} from "lucide-react";
import type { Room } from "@/types/room";
import { seatService } from "@/services/seatService";

interface SeatInfo {
   id: string;
   seatNumber: string;
   rowChar: string;
   rowIndex: number;
   columnIndex: number;
   seatTypeId: string;
   seatType?: {
      id: string;
      name: string;
      color?: string;
   };
   roomId: string;
}

interface RoomDetailDialogProps {
   room: Room | null;
   open: boolean;
   onClose: () => void;
}

const formatTime = (time?: string) => {
   if (!time) return "—";
   return time.substring(0, 5);
};

const formatDate = (ts?: string | number) => {
   if (!ts) return "—";
   return new Date(ts).toLocaleString("vi-VN");
};

// Màu sắc theo loại ghế
const getSeatColor = (seatType?: SeatInfo["seatType"]) => {
   const name = seatType?.name?.toLowerCase() ?? "";
   if (name.includes("vip")) return "bg-amber-500/80 border-amber-400 text-amber-100";
   if (name.includes("couple") || name.includes("đôi"))
      return "bg-pink-500/80 border-pink-400 text-pink-100";
   return "bg-indigo-500/60 border-indigo-400 text-indigo-100";
};

const getSeatLegendColor = (name: string) => {
   const n = name.toLowerCase();
   if (n.includes("vip")) return "bg-amber-500";
   if (n.includes("couple") || n.includes("đôi")) return "bg-pink-500";
   return "bg-indigo-500";
};

export default function RoomDetailDialog({
   room,
   open,
   onClose,
}: RoomDetailDialogProps) {
   const [seats, setSeats] = useState<SeatInfo[]>([]);
   const [loadingSeats, setLoadingSeats] = useState(false);
   const [seatError, setSeatError] = useState<string | null>(null);

   useEffect(() => {
      if (!open || !room) return;
      setSeats([]);
      setSeatError(null);
      setLoadingSeats(true);

      seatService
         .getSeatsByRoom(room.id)
         .then((res: any) => {
            const data = res?.data ?? res;
            setSeats(Array.isArray(data) ? data : []);
         })
         .catch(() => setSeatError("Không thể tải danh sách ghế."))
         .finally(() => setLoadingSeats(false));
   }, [open, room]);

   // Build seat grid
   const rows = Array.from(new Set(seats.map((s) => s.rowChar))).sort();
   const maxCols =
      seats.length > 0 ? Math.max(...seats.map((s) => s.columnIndex)) : 0;

   // Group seats for legend
   const seatTypes = Array.from(
      new Map(
         seats
            .filter((s) => s.seatType)
            .map((s) => [s.seatType!.id, s.seatType!])
      ).values()
   );

   if (!room) return null;

   return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
         <DialogContent className="max-w-4xl bg-[#111114] border border-white/10 text-white p-0 overflow-hidden">
            {/* Header */}
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10 bg-gradient-to-r from-rose-900/30 to-transparent">
               <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                     <Layers size={20} className="text-rose-400" />
                  </div>
                  <div>
                     <div className="text-white">{room.name}</div>
                     <div className="text-xs text-[#797b7d] font-normal mt-0.5">
                        ID: {room.id}
                     </div>
                  </div>
               </DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[75vh] px-6 py-5 space-y-6">
               {/* Info Cards */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <InfoCard
                     icon={<Building2 size={16} className="text-rose-400" />}
                     label="Chi nhánh"
                     value={(room as any).branchName || "—"}
                  />
                  <InfoCard
                     icon={<Users size={16} className="text-indigo-400" />}
                     label="Tổng số ghế"
                     value={`${room.totalSeats} ghế`}
                  />
                  <InfoCard
                     icon={<Clock size={16} className="text-emerald-400" />}
                     label="Giờ hoạt động"
                     value={
                        room.openTime && room.closeTime
                           ? `${formatTime(room.openTime)} – ${formatTime(room.closeTime)}`
                           : "Chưa thiết lập"
                     }
                  />
                  <InfoCard
                     icon={<Calendar size={16} className="text-blue-400" />}
                     label="Ngày tạo"
                     value={formatDate((room as any).createTime)}
                  />
               </div>

               {/* Seat Map */}
               <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                        <Armchair size={15} className="text-rose-400" />
                        Sơ đồ ghế
                     </div>
                     {!loadingSeats && seats.length > 0 && (
                        <span className="text-xs text-[#797b7d]">
                           {seats.length} ghế
                        </span>
                     )}
                  </div>

                  <div className="p-4">
                     {loadingSeats ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-[#797b7d]">
                           <Loader2 size={28} className="animate-spin text-rose-400" />
                           <span className="text-sm">Đang tải sơ đồ ghế...</span>
                        </div>
                     ) : seatError ? (
                        <div className="flex items-center gap-2 justify-center py-8 text-red-400 text-sm">
                           <AlertCircle size={16} /> {seatError}
                        </div>
                     ) : seats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2 text-[#797b7d]">
                           <Info size={24} />
                           <span className="text-sm">Phòng chưa có ghế nào</span>
                        </div>
                     ) : (
                        <div className="space-y-4">
                           {/* Screen */}
                           <div className="relative flex justify-center mb-2">
                              <span className="absolute -bottom-4 text-[10px] text-[#797b7d] tracking-widest uppercase">
                                 Màn hình
                              </span>
                           </div>

                           {/* Grid */}
                           <div className="overflow-x-auto pt-6">
                              <div className="w-max mx-auto">
                                 {rows.map((rowChar) => {
                                    const rowSeats = seats
                                       .filter((s) => s.rowChar === rowChar)
                                       .sort((a, b) => a.columnIndex - b.columnIndex);

                                    return (
                                       <div
                                          key={rowChar}
                                          className="flex items-center gap-1 mb-1"
                                       >
                                          {/* Row label */}
                                          <span className="w-6 text-center text-xs font-bold text-[#797b7d] flex-shrink-0">
                                             {rowChar}
                                          </span>

                                          {/* Seats */}
                                          <div className="flex gap-1 flex-wrap">
                                             {Array.from(
                                                { length: maxCols },
                                                (_, colIdx) => {
                                                   const seat = rowSeats.find(
                                                      (s) => s.columnIndex === colIdx + 1
                                                   );
                                                   if (!seat) {
                                                      return (
                                                         <div
                                                            key={colIdx}
                                                            className="w-7 h-7"
                                                         />
                                                      );
                                                   }
                                                   return (
                                                      <div
                                                         key={seat.id}
                                                         title={`${seat.rowChar}${seat.columnIndex} - ${seat.seatType?.name ?? "Thường"}`}
                                                         className={`w-7 h-7 rounded border text-[9px] font-semibold flex items-center justify-center cursor-default transition-transform hover:scale-110 ${getSeatColor(seat.seatType)}`}
                                                      >
                                                         {seat.columnIndex}
                                                      </div>
                                                   );
                                                }
                                             )}
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>

                           {/* Legend */}
                           {seatTypes.length > 0 && (
                              <div className="flex justify-center flex-wrap gap-8 pt-5 mt-4 border-t border-white/10">
                                 {seatTypes.map((st) => (
                                    <div
                                       key={st.id}
                                       className="flex items-center gap-2"
                                    >
                                       <div
                                          className={`w-5 h-5 rounded border ${getSeatColor(st)} shadow-sm`}
                                       />
                                       <span className="text-sm font-medium text-gray-300">
                                          {st.name}
                                       </span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}

function InfoCard({
   icon,
   label,
   value,
}: {
   icon: React.ReactNode;
   label: string;
   value: string;
}) {
   return (
      <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 space-y-1.5">
         <div className="flex items-center gap-1.5 text-[#797b7d] text-xs">
            {icon}
            {label}
         </div>
         <div className="text-white text-sm font-semibold leading-tight">{value}</div>
      </div>
   );
}
