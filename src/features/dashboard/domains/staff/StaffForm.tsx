import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { employeeService } from "@/services/employeeService";
import type { Employee } from "@/types/employee";

const staffSchema = z.object({
   username: z.string().optional(),
   password: z.string().optional(),
   name: z.string().min(1, "Họ tên là bắt buộc"),
   email: z.string().email("Email không hợp lệ"),
   phone: z.string().min(1, "Số điện thoại là bắt buộc"),
   branchId: z.string().uuid("Vui lòng chọn chi nhánh"),
   employeeCode: z.string().optional(),
   positionId: z.string().uuid("Vui lòng chọn chức vụ"),
   salary: z.coerce.number().optional(),
   hireDate: z.string().optional(),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffFormProps {
   initialData?: Employee | null;
   branchOptions: { value: string; label: string }[];
   positionOptions: { value: string; label: string }[];
   onCancel: () => void;
   onSuccess: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({
   initialData,
   branchOptions,
   positionOptions,
   onCancel,
   onSuccess,
}) => {
   const [loading, setLoading] = useState(false);
   const isEdit = !!initialData;

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<StaffFormValues>({
      resolver: zodResolver(staffSchema),
      defaultValues: {
         username: "",
         password: "",
         name: "",
         email: "",
         phone: "",
         branchId: "",
         employeeCode: "",
         positionId: "",
         salary: undefined,
         hireDate: "",
      },
   });

   useEffect(() => {
      if (initialData) {
         reset({
            name: initialData.name,
            email: initialData.email,
            phone: initialData.phone,
            branchId: initialData.branchId || "",
            positionId: initialData.positionId || "",
            salary: initialData.salary,
            hireDate: initialData.hireDate || "",
         });
      }
   }, [initialData, reset]);

   const onSubmit = async (data: StaffFormValues) => {
      if (!isEdit) {
         if (!data.username?.trim()) {
            toast.error("Tên đăng nhập là bắt buộc");
            return;
         }
         if (!data.password?.trim()) {
            toast.error("Mật khẩu là bắt buộc");
            return;
         }
         if (!data.employeeCode?.trim()) {
            toast.error("Mã nhân viên là bắt buộc");
            return;
         }
      }

      setLoading(true);
      try {
         if (isEdit) {
            await employeeService.update(initialData!.userId, {
               name: data.name,
               email: data.email,
               phone: data.phone,
               branchId: data.branchId,
               positionId: data.positionId,
               salary: data.salary,
               hireDate: data.hireDate || undefined,
            });
            toast.success("Cập nhật nhân sự thành công");
         } else {
            await employeeService.create({
               username: data.username!,
               password: data.password!,
               name: data.name,
               email: data.email,
               phone: data.phone,
               branchId: data.branchId,
               employeeCode: data.employeeCode!,
               positionId: data.positionId,
               salary: data.salary,
               hireDate: data.hireDate || undefined,
            });
            toast.success("Tạo nhân sự mới thành công");
         }
         onSuccess();
      } catch (error: any) {
         toast.error(
            error.response?.data?.message || "Có lỗi xảy ra khi lưu thông tin",
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isEdit && (
               <>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-300">
                        Tên đăng nhập *
                     </label>
                     <input
                        {...register("username")}
                        className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
                     />
                     {errors.username && (
                        <p className="text-rose-500 text-xs">
                           {errors.username.message}
                        </p>
                     )}
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-300">
                        Mật khẩu *
                     </label>
                     <input
                        type="password"
                        {...register("password")}
                        className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
                     />
                     {errors.password && (
                        <p className="text-rose-500 text-xs">
                           {errors.password.message}
                        </p>
                     )}
                  </div>
               </>
            )}

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Họ tên *
               </label>
               <input
                  {...register("name")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               />
               {errors.name && (
                  <p className="text-rose-500 text-xs">{errors.name.message}</p>
               )}
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Email *
               </label>
               <input
                  {...register("email")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               />
               {errors.email && (
                  <p className="text-rose-500 text-xs">
                     {errors.email.message}
                  </p>
               )}
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Số điện thoại *
               </label>
               <input
                  {...register("phone")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               />
               {errors.phone && (
                  <p className="text-rose-500 text-xs">{errors.phone.message}</p>
               )}
            </div>

            {!isEdit && (
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                     Mã nhân viên *
                  </label>
                  <input
                     {...register("employeeCode")}
                     className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
                  />
                  {errors.employeeCode && (
                     <p className="text-rose-500 text-xs">
                        {errors.employeeCode.message}
                     </p>
                  )}
               </div>
            )}

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
                     {errors.branchId.message}
                  </p>
               )}
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Chức vụ *
               </label>
               <select
                  {...register("positionId")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               >
                  <option value="">Chọn chức vụ</option>
                  {positionOptions.map((opt) => (
                     <option key={opt.value} value={opt.value}>
                        {opt.label}
                     </option>
                  ))}
               </select>
               {errors.positionId && (
                  <p className="text-rose-500 text-xs">
                     {errors.positionId.message}
                  </p>
               )}
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Lương (VNĐ)
               </label>
               <input
                  type="number"
                  {...register("salary")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Ngày vào làm
               </label>
               <input
                  type="date"
                  {...register("hireDate")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               />
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
               {loading
                  ? "Đang lưu..."
                  : isEdit
                    ? "Cập nhật nhân sự"
                    : "Tạo nhân sự"}
            </Button>
         </div>
      </form>
   );
};

export default StaffForm;
