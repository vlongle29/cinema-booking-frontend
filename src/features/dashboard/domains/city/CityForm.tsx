import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { dashboardCityService } from "@/features/dashboard/services/dashboard.city.service";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";
import type { City } from "@/types/city";
import toast from "react-hot-toast";

const citySchema = z.object({
   name: z.string().min(1, "Tên thành phố là bắt buộc"),
   code: z.string().optional(),
});

interface CityFormProps {
   initialData?: City | null;
   onCancel: () => void;
   onSuccess: () => void;
}

const CityForm: React.FC<CityFormProps> = ({ initialData, onCancel, onSuccess }) => {
   const [loading, setLoading] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm({
      resolver: zodResolver(citySchema),
      defaultValues: initialData
         ? { name: initialData.name, code: initialData.code || "" }
         : { name: "", code: "" },
   });

   useEffect(() => {
      if (initialData) {
         reset({ name: initialData.name, code: initialData.code || "" });
      }
   }, [initialData, reset]);

   const onSubmit = async (data: any) => {
      setLoading(true);
      try {
         const payload = {
            name: data.name,
            code: data.code || undefined,
         };

         if (initialData) {
            await dashboardCityService.update(initialData.id, payload);
            toast.success("Cập nhật thành phố thành công");
         } else {
            await dashboardCityService.create(payload);
            toast.success("Tạo thành phố mới thành công");
         }
         onSuccess();
      } catch (error) {
         toast.error("Có lỗi xảy ra khi lưu thông tin");
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên thành phố */}
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Tên thành phố *
               </label>
               <input
                  {...register("name")}
                  placeholder="VD: Hà Nội, TP. Hồ Chí Minh..."
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none placeholder:text-gray-600"
               />
               {errors.name && (
                  <p className="text-rose-500 text-xs">
                     {errors.name.message as string}
                  </p>
               )}
            </div>

            {/* Mã thành phố */}
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Mã thành phố <span className="text-gray-500">(Tùy chọn)</span>
               </label>
               <input
                  {...register("code")}
                  placeholder="VD: HN, HCM, DN..."
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none placeholder:text-gray-600 uppercase"
               />
               {errors.code && (
                  <p className="text-rose-500 text-xs">
                     {errors.code.message as string}
                  </p>
               )}
            </div>
         </div>

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
               {loading ? "Đang lưu..." : "Lưu thành phố"}
            </Button>
         </div>
      </form>
   );
};

export default CityForm;
