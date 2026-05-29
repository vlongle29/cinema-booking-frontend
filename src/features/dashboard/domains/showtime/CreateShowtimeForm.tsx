import React from "react";
import { Film, MapPin, Monitor, Calendar, Clock, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import type { Movie, Branch, Room, ShowtimeFormat, City } from "../../../types/showtime";
import type { ShowtimeFormData, BatchCreateShowtimeResponse } from "../../../hooks/useCreateShowtime";

interface CreateShowtimeFormProps {
   formData: ShowtimeFormData;
   options: {
      movies: Movie[];
      cities: City[];
      branch: Branch[];
      rooms: Room[];
      formats: ShowtimeFormat[];
      availableSlots: string[];
   };
   status: {
      isLoading: boolean;
      isFetching: boolean;
      isFetchingSlots: boolean;
      error: string | null;
      success: boolean;
      batchResult: BatchCreateShowtimeResponse | null;
   };
   updateField: (name: keyof ShowtimeFormData, value: string | string[]) => void;
   toggleSlot: (slot: string) => void;
   onSubmit: (e: React.FormEvent) => void;
   onCancel: () => void;
}

export default function CreateShowtimeForm({
   formData, options, status, updateField, toggleSlot, onSubmit, onCancel
}: CreateShowtimeFormProps) {
   const { batchResult } = status;

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      updateField(name as keyof ShowtimeFormData, value);
   };

   return (
      <div className="space-y-6">
         {status.success && (
                  <div className="flex flex-col gap-2 mb-5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-[6px] text-emerald-400 text-sm font-medium">
                     <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Đã tạo thành công {batchResult?.created.length} suất chiếu!</span>
                     </div>
                  </div>
               )}

               {batchResult && batchResult.rejected.length > 0 && (
                  <div className="flex flex-col gap-2 mb-5 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-[6px] text-amber-400 text-sm font-medium">
                     <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{batchResult.rejected.length} suất chiếu bị từ chối do trùng lịch:</span>
                     </div>
                     <ul className="list-disc list-inside ml-6 text-xs text-amber-500/80">
                        {batchResult.rejected.map((item: any, idx: number) => (
                           <li key={idx}>
                              <span className="font-semibold">{item.timeStr}</span>: {item.reason}
                           </li>
                        ))}
                     </ul>
                  </div>
               )}

               <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <Film className="w-3 h-3" /> Movie *
                        </label>
                        <select
                           name="movieId"
                           value={formData.movieId}
                           onChange={handleInputChange}
                           required
                           className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]"
                           disabled={status.isFetching}
                        >
                           <option value="">Select a movie</option>
                           {options.movies.map((m: Movie) => (
                              <option key={m.id} value={m.id}>{m.title}</option>
                           ))}
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <MapPin className="w-3 h-3" /> City *
                        </label>
                        <select
                           name="cityId"
                           value={formData.cityId}
                           onChange={handleInputChange}
                           required
                           className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]"
                           disabled={status.isFetching}
                        >
                           <option value="">Select a city</option>
                           {options.cities.map((c: City) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                           ))}
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <MapPin className="w-3 h-3" /> Branch *
                        </label>
                        <select
                           name="branchId"
                           value={formData.branchId}
                           onChange={handleInputChange}
                           required
                           className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]"
                           disabled={!formData.cityId || status.isFetching}
                        >
                           <option value="">Select a branch</option>
                           {options.branch.map((b: Branch) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                           ))}
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <Monitor className="w-3 h-3" /> Room *
                        </label>
                        <select
                           name="roomId"
                           value={formData.roomId}
                           onChange={handleInputChange}
                           required
                           className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]"
                           disabled={!formData.branchId || status.isFetching}
                        >
                           <option value="">Select a room</option>
                           {options.rooms.map((r: Room) => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                           ))}
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <Film className="w-3 h-3" /> Format *
                        </label>
                        <div className="flex gap-4 pt-1 flex-wrap">
                           {options.formats.map((fmt: ShowtimeFormat) => (
                              <label key={fmt.format} className="flex items-center gap-2 cursor-pointer">
                                 <input
                                    type="radio"
                                    name="format"
                                    value={fmt.format}
                                    checked={formData.format === fmt.format}
                                    onChange={handleInputChange}
                                    className="text-[#f84565] focus:ring-[#f84565] bg-[#1a1a1e] border-[#393939]"
                                 />
                                 <span className="text-white text-sm">{fmt.displayName}</span>
                              </label>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <Calendar className="w-3 h-3" /> Date *
                        </label>
                        <input
                           type="date"
                           name="date"
                           value={formData.date}
                           onChange={handleInputChange}
                           required
                           min={new Date().toISOString().split("T")[0]}
                           className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565] [color-scheme:dark]"
                           disabled={!formData.roomId || !formData.movieId}
                        />
                     </div>
                  </div>

                  {(formData.roomId && formData.movieId && formData.date) && (
                     <div className="space-y-3 pt-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <Clock className="w-3 h-3" /> Available Time Slots *
                           {formData.selectedSlots.length > 0 && (
                              <span className="ml-1 px-2 py-0.5 bg-[#f84565]/20 text-[#f84565] rounded-full text-[10px] font-semibold">
                                 {formData.selectedSlots.length} selected
                              </span>
                           )}
                        </label>

                        {status.isFetchingSlots && (
                           <div className="flex items-center gap-2 text-[#797b7d] text-sm py-4">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Loading available slots…
                           </div>
                        )}

                        {!status.isFetchingSlots && options.availableSlots.length === 0 && (
                           <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1e] border border-[#393939] rounded-[6px] text-[#797b7d] text-sm">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              No available time slots for this date.
                           </div>
                        )}

                        {!status.isFetchingSlots && options.availableSlots.length > 0 && (
                           <>
                              <div className="flex flex-wrap gap-2">
                                 {options.availableSlots.map((slot: string) => {
                                    const isSelected = formData.selectedSlots.includes(slot);
                                    return (
                                       <button
                                          key={slot}
                                          type="button"
                                          onClick={() => toggleSlot(slot)}
                                          className={`
                                             flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm font-medium
                                             border transition-all duration-150 select-none
                                             ${isSelected
                                                ? "bg-[#f84565] border-[#f84565] text-white shadow-[0_0_10px_rgba(248,69,101,0.35)]"
                                                : "bg-[#1a1a1e] border-[#393939] text-[#d1d5dc] hover:border-[#f84565] hover:text-white"
                                             }
                                          `}
                                       >
                                          <Clock className="w-3 h-3" />
                                          {slot}
                                       </button>
                                    );
                                 })}
                              </div>
                           </>
                        )}
                     </div>
                  )}

                  {status.error && (
                     <div className="text-[#f84565] text-sm mt-2 font-medium">{status.error}</div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-[#393939]">
                     <button
                        type="submit"
                        disabled={status.isLoading || formData.selectedSlots.length === 0}
                        className="px-5 py-2 bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold rounded-[6px] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        {status.isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {status.isLoading
                           ? "Creating…"
                           : formData.selectedSlots.length > 1
                             ? `Batch Create ${formData.selectedSlots.length} Showtimes`
                             : "Create Showtime"}
                     </button>
                     <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 bg-[#1a1a1e] hover:bg-[#252529] text-[#d1d5dc] font-semibold border border-[#393939] rounded-[6px] transition-colors text-sm"
                     >
                        Cancel
                     </button>
                  </div>
               </form>
      </div>
   );
}