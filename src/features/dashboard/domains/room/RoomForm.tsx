import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { roomService } from "@/features/dashboard/services/dashboard.room.service";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";
import type { Room } from "@/types/room";
import toast from "react-hot-toast";

const roomSchema = z.object({
   name: z.string().min(1, "Tên phòng là bắt buộc"),
   totalSeats: z
      .number({ invalid_type_error: "Số ghế là bắt buộc" })
      .positive("Số ghế phải lớn hơn 0")
      .int("Số ghế phải là số nguyên"),
   branchId: z.string().uuid("Chi nhánh không hợp lệ").min(1, "Vui lòng chọn chi nhánh"),
   openTime: z.string().optional(),
   closeTime: z.string().optional(),
});

interface RoomFormProps {
   initialData?: Room | null;
   branchOptions: { value: string; label: string }[];
   onCancel: () => void;
   onSuccess: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({
   initialData,
   branchOptions,
   onCancel,
   onSuccess,
}) => {
   const [loading, setLoading] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm({
      resolver: zodResolver(roomSchema),
      defaultValues: initialData
         ? {
              name: initialData.name,
              totalSeats: initialData.totalSeats,
              branchId: initialData.branchId,
              openTime: initialData.openTime?.substring(0, 5) ?? "",
              closeTime: initialData.closeTime?.substring(0, 5) ?? "",
           }
         : {
              name: "",
              totalSeats: undefined as any,
              branchId: "",
              openTime: "",
              closeTime: "",
           },
   });

   useEffect(() => {
      if (initialData) {
         reset({
            name: initialData.name,
            totalSeats: initialData.totalSeats,
            branchId: initialData.branchId,
            openTime: initialData.openTime?.substring(0, 5) ?? "",
            closeTime: initialData.closeTime?.substring(0, 5) ?? "",
         });
      }
   }, [initialData, reset]);

   const onSubmit = async (data: any) => {
      setLoading(true);
      try {
         // Convert "HH:mm" → "HH:mm:ss" for backend LocalTime
         const payload = {
            ...data,
            totalSeats: Number(data.totalSeats),
            openTime: data.openTime ? `${data.openTime}:00` : undefined,
            closeTime: data.closeTime ? `${data.closeTime}:00` : undefined,
         };

         if (initialData) {
            await roomService.update(initialData.id, payload);
            toast.success("Cập nhật phòng chiếu thành công");
         } else {
            await roomService.create(payload);
            toast.success("Tạo phòng chiếu mới thành công");
         }
         onSuccess();
      } catch (error: any) {
         const msg =
            error?.response?.data?.message || "Có lỗi xảy ra khi lưu thông tin";
         toast.error(msg);
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên phòng */}
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Tên phòng *
               </label>
               <input
                  {...register("name")}
                  placeholder="VD: Phòng 1, Phòng IMAX..."
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none placeholder-gray-600"
               />
               {errors.name && (
                  <p className="text-rose-500 text-xs">{errors.name.message as string}</p>
               )}
            </div>

            {/* Chi nhánh */}
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Chi nhánh *
               </label>
               <select
                  {...register("branchId")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               >
                  <option value="">Chọn chi nhánh</option>
                  {branchOptions.map((opt) => (
                     <option key={opt.value} value={opt.value}>
                        {opt.label}
                     </option>
                  ))}
               </select>
               {errors.branchId && (
                  <p className="text-rose-500 text-xs">
                     {errors.branchId.message as string}
                  </p>
               )}
            </div>

            {/* Số ghế */}
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Số ghế *
               </label>
               <input
                  {...register("totalSeats", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  placeholder="VD: 120"
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none placeholder-gray-600"
               />
               {errors.totalSeats && (
                  <p className="text-rose-500 text-xs">
                     {errors.totalSeats.message as string}
                  </p>
               )}
            </div>

            {/* Giờ mở cửa */}
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Giờ mở cửa
               </label>
               <input
                  {...register("openTime")}
                  type="time"
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none [color-scheme:dark]"
               />
               {errors.openTime && (
                  <p className="text-rose-500 text-xs">
                     {errors.openTime.message as string}
                  </p>
               )}
            </div>

            {/* Giờ đóng cửa */}
            <div className="space-y-2 md:col-start-2">
               <label className="text-sm font-medium text-gray-300">
                  Giờ đóng cửa
               </label>
               <input
                  {...register("closeTime")}
                  type="time"
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none [color-scheme:dark]"
               />
               {errors.closeTime && (
                  <p className="text-rose-500 text-xs">
                     {errors.closeTime.message as string}
                  </p>
               )}
            </div>
         </div>

         {/* Actions */}
         <div className="flex justify-end gap-4 pt-4">
            <Button
               type="button"
               variant="ghost"
               onClick={onCancel}
               className="text-gray-400"
            >
               <X size={16} className="mr-2" /> Hủy
            </Button>
            <Button
               type="submit"
               disabled={loading}
               className="bg-rose-500 hover:bg-rose-600 text-white"
            >
               <Save size={16} className="mr-2" />
               {loading ? "Đang lưu..." : initialData ? "Cập nhật phòng" : "Tạo phòng"}
            </Button>
         </div>
      </form>
   );
};

export default RoomForm;
