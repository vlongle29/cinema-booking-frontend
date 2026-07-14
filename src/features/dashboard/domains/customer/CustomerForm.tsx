import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { customerService } from "@/services/customerService";
import type { Customer, Gender } from "@/types/customer";

const customerSchema = z.object({
   username: z.string().optional(),
   password: z.string().optional(),
   name: z.string().min(1, "Họ tên là bắt buộc"),
   email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
   phone: z
      .string()
      .regex(/^0\d{9,10}$/, "Số điện thoại không hợp lệ (bắt đầu bằng 0)"),
   dateOfBirth: z.string().optional(),
   gender: z.enum(["MALE", "FEMALE", "OTHER", ""]).optional(),
   address: z.string().optional(),
   city: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
   initialData?: Customer | null;
   onCancel: () => void;
   onSuccess: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
   initialData,
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
   } = useForm<CustomerFormValues>({
      resolver: zodResolver(customerSchema),
      defaultValues: {
         username: "",
         password: "",
         name: "",
         email: "",
         phone: "",
         dateOfBirth: "",
         gender: "",
         address: "",
         city: "",
      },
   });

   useEffect(() => {
      if (initialData) {
         reset({
            name: initialData.name,
            email: initialData.email,
            phone: initialData.phone,
            dateOfBirth: initialData.dateOfBirth || "",
            gender: initialData.gender || "",
            address: initialData.address || "",
            city: initialData.city || "",
         });
      }
   }, [initialData, reset]);

   const onSubmit = async (data: CustomerFormValues) => {
      if (!isEdit) {
         if (!data.username?.trim()) {
            toast.error("Tên đăng nhập là bắt buộc");
            return;
         }
         if (!data.password?.trim()) {
            toast.error("Mật khẩu là bắt buộc");
            return;
         }
         if (!data.email?.trim()) {
            toast.error("Email là bắt buộc");
            return;
         }
      }

      setLoading(true);
      try {
         if (isEdit) {
            await customerService.update(initialData!.userId, {
               name: data.name,
               phone: data.phone,
               dateOfBirth: data.dateOfBirth || undefined,
               gender: (data.gender as Gender) || undefined,
               address: data.address,
               city: data.city,
            });
            toast.success("Cập nhật khách hàng thành công");
         } else {
            await customerService.create({
               username: data.username!,
               password: data.password!,
               name: data.name,
               email: data.email!,
               phone: data.phone,
               dateOfBirth: data.dateOfBirth || undefined,
               gender: data.gender || undefined,
               address: data.address,
               city: data.city,
            });
            toast.success("Tạo khách hàng mới thành công");
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

            {!isEdit && (
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
            )}

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

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Ngày sinh
               </label>
               <input
                  type="date"
                  {...register("dateOfBirth")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Giới tính
               </label>
               <select
                  {...register("gender")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">
                  Thành phố
               </label>
               <input
                  {...register("city")}
                  className="w-full bg-[#1a1a1d] border border-gray-700 rounded-md p-2 text-white focus:border-rose-500 outline-none"
               />
            </div>

            <div className="space-y-2 md:col-span-2">
               <label className="text-sm font-medium text-gray-300">
                  Địa chỉ
               </label>
               <input
                  {...register("address")}
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
                    ? "Cập nhật khách hàng"
                    : "Tạo khách hàng"}
            </Button>
         </div>
      </form>
   );
};

export default CustomerForm;
