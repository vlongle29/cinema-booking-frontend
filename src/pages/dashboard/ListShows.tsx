import { useState } from "react";
import {
   Calendar,
   DollarSign,
   Film,
   Clock,
   MapPin,
   Monitor,
   Plus,
   X,
} from "lucide-react";
import { useCreateShowtime } from "../../hooks/useCreateShowtime";

export default function ListShows() {
   const [isCreating, setIsCreating] = useState(false);

   // Sử dụng Custom Hook
   const { formData, updateField, submitForm, options, status } = useCreateShowtime();

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      updateField(name as any, value);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await submitForm();
      if (status.success) {
         setIsCreating(false);
      }
   };

   return (
      <>
         <div className="mb-6 mt-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">
               {isCreating ? "Create " : "List "}
               <span className="underline decoration-[#f84565] text-[#f84565]">
                  Showtime
               </span>
            </h1>
            {!isCreating && (
               <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold rounded-[6px] transition-colors text-sm"
               >
                  <Plus className="w-4 h-4" />
                  Add Showtime
               </button>
            )}
            {isCreating && (
               <button
                  onClick={() => setIsCreating(false)}
                  className="text-[#d1d5dc] hover:text-white transition-colors text-sm flex items-center gap-1"
               >
                  <X className="w-4 h-4" /> Cancel
               </button>
            )}
         </div>

         {isCreating ? (
            <div className="bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-[8px] p-6">
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Movie Selection */}
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
                           {options.movies.map((m) => (
                              <option key={m.id} value={m.id}>
                                 {m.title}
                              </option>
                           ))}
                        </select>
                     </div>

                     {/* City Selection */}
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
                           {options.cities.map((c) => (
                              <option key={c.id} value={c.id}>
                                 {c.name}
                              </option>
                           ))}
                        </select>
                     </div>

                     {/* Branch Selection */}
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
                           {options.branches.map((b) => (
                              <option key={b.id} value={b.id}>
                                 {b.name}
                              </option>
                           ))}
                        </select>
                     </div>

                     {/* Room Selection */}
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
                           {options.rooms.map((r) => (
                              <option key={r.id} value={r.id}>
                                 {r.name}
                              </option>
                           ))}
                        </select>
                     </div>

                     {/* Format Selection */}
                     <div className="space-y-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <Film className="w-3 h-3" /> Format *
                        </label>
                        <div className="flex gap-4 pt-1 flex-wrap">
                           {options.formats.map((fmt) => (
                              <label
                                 key={fmt.format}
                                 className="flex items-center gap-2 cursor-pointer"
                              >
                                 <input
                                    type="radio"
                                    name="format"
                                    value={fmt.format}
                                    checked={formData.format === fmt.format}
                                    onChange={handleInputChange}
                                    className="text-[#f84565] focus:ring-[#f84565] bg-[#1a1a1e] border-[#393939]"
                                 />
                                 <span className="text-white text-sm">
                                    {fmt.displayName}
                                 </span>
                              </label>
                           ))}
                        </div>
                     </div>

                     {/* Start Time */}
                     <div className="space-y-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <Clock className="w-3 h-3" /> Start Time *
                        </label>
                        <input
                           type="datetime-local"
                           name="startTime"
                           value={formData.startTime}
                           onChange={handleInputChange}
                           required
                           className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565] [color-scheme:dark]"
                        />
                     </div>

                     {/* End Time */}
                     <div className="space-y-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <Clock className="w-3 h-3" /> End Time (Optional)
                        </label>
                        <input
                           type="datetime-local"
                           name="endTime"
                           value={formData.endTime}
                           onChange={handleInputChange}
                           className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565] [color-scheme:dark]"
                        />
                     </div>

                     {/* Price */}
                     <div className="space-y-2">
                        <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                           <DollarSign className="w-3 h-3" /> Price (VND) *
                        </label>
                        <input
                           type="number"
                           name="price"
                           value={formData.price}
                           onChange={handleInputChange}
                           placeholder="e.g. 75000"
                           required
                           min="0"
                           step="1000"
                           className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]"
                        />
                     </div>
                  </div>

                  {/* Error Message */}
                  {status.error && (
                     <div className="text-[#f84565] text-sm mt-2 font-medium">
                        {status.error}
                     </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-[#393939]">
                     <button
                        type="submit"
                        disabled={status.isLoading}
                        className="px-5 py-2 bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold rounded-[6px] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        {status.isLoading ? "Creating..." : "Create Showtime"}
                     </button>
                     <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-5 py-2 bg-[#1a1a1e] hover:bg-[#252529] text-[#d1d5dc] font-semibold border border-[#393939] rounded-[6px] transition-colors text-sm"
                     >
                        Cancel
                     </button>
                  </div>
               </form>
            </div>
         ) : (
            <div className="bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-[8px] p-8 min-h-[500px] flex items-center justify-center">
               <div className="text-center">
                  <Calendar className="w-12 h-12 text-[#f84565] mx-auto mb-4 opacity-50" />
                  <p className="text-white text-lg font-medium">
                     No showtimes found
                  </p>
                  <p className="text-[#797b7d] text-sm mt-2">
                     Get started by creating a new showtime.
                  </p>
               </div>
            </div>
         )}
      </>
   );
}
