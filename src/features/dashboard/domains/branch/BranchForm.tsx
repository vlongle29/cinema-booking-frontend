import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { branchService } from "@/features/dashboard/services/dashboard.branch.service";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";
import type { Branch } from "@/types/branch";
import toast from "react-hot-toast";

const branchSchema = z.object({
   name: z.string().min(1, "Tên chi nhánh là bắt buộc"),
   address: z.string().min(1, "Địa chỉ là bắt buộc"),
   cityId: z.string().uuid("Vui lòng chọn thành phố"),
   managerId: z.string().uuid("Vui lòng chọn quản lý").optional(),
});

interface BranchFormProps {
   initialData?: Branch | null;
   onCancel: () => void;
   onSuccess: () => void;
}

const BranchForm: React.FC<BranchFormProps> = ({
   initialData,
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
      resolver: zodResolver(branchSchema),
      defaultValues: initialData || {
         name: "",
         address: "",
         cityId: "",
         managerId: "",
      },
   });

   useEffect(() => {
      if (initialData) reset(initialData);
   }, [initialData, reset]);

   const onSubmit = async (data: any) => {
      setLoading(true);
      try {
         if (initialData) {
            await branchService.update(initialData.id, data);
            toast.success("Cập nhật chi nhánh thành công");
         } else {
            await branchService.create(data);
            toast.success("Tạo chi nhánh mới thành công");
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
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Tên chi nhánh *
               </label>
               <input
                  {...register("name")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               />
               {errors.name && (
                  <p className="text-rose-500 text-xs">
                     {errors.name.message as string}
                  </p>
               )}
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Địa chỉ *
               </label>
               <input
                  {...register("address")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               />
               {errors.address && (
                  <p className="text-rose-500 text-xs">
                     {errors.address.message as string}
                  </p>
               )}
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Thành phố *
               </label>
               <select
                  {...register("cityId")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               >
                  <option value="">Chọn thành phố</option>
                  {/* Map cities here */}
               </select>
               {errors.cityId && (
                  <p className="text-rose-500 text-xs">
                     {errors.cityId.message as string}
                  </p>
               )}
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Người quản lý
               </label>
               <select
                  {...register("managerId")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               >
                  <option value="">Chọn quản lý</option>
                  {/* Map managers here */}
               </select>
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
               <Save size={16} className="mr-2" />{" "}
               {loading ? "Đang lưu..." : "Lưu chi nhánh"}
            </Button>
         </div>
      </form>
   );
};

export default BranchForm;
