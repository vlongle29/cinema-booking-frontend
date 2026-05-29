import React, { useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserFormValues } from "@/utils/validationUtil";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { userSchema } from "@/utils/validationUtil";
import {
   NativeSelect,
   NativeSelectOption,
} from "@/components/ui/native-select";
import type { UserInfoResponse } from "@/types/user";
import type { SysRoleResponse } from "@/types/role";
import AvatarUpload from "./AvatarUpload";

interface UserModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (data: UserFormValues) => void;
   initialData?: UserInfoResponse | null;
   roles: SysRoleResponse[];
   loading?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
   isOpen,
   onClose,
   onSubmit,
   initialData,
   roles,
   loading,
}) => {
   const [showPassword, setShowPassword] = React.useState(false);

   const {
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors },
   } = useForm<UserFormValues>({
      resolver: zodResolver(userSchema),
      defaultValues: {
         roleIds: [],
      },
   });

   useEffect(() => {
      if (initialData) {
         reset({
            username: initialData.username,
            name: initialData.name,
            email: initialData.email,
            phone: initialData.phone,
            roleIds: initialData.roles.map((r) => r.id),
            avatar: initialData.avatar || "",
            // branchId: initialData.branchId, // Giả định có field này
         });
      } else {
         reset({
            username: "",
            name: "",
            email: "",
            phone: "",
            roleIds: [],
            password: "",
         });
      }
   }, [initialData, reset, isOpen]);

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
         <div className="bg-[#1a1a1e] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
               <h2 className="text-xl font-bold text-white">
                  {initialData ? "Cập nhật người dùng" : "Thêm người dùng mới"}
               </h2>
               <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition-colors"
               >
                  <X size={24} />
               </button>
            </div>

            <form
               onSubmit={handleSubmit(onSubmit)}
               className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
            >
               {/* Avatar Section */}
               <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                     <AvatarUpload
                        value={field.value}
                        onChange={field.onChange}
                     />
                  )}
               />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1">
                        Tên đăng nhập *
                     </label>
                     <input
                        {...register("username")}
                        className={`w-full px-4 py-2 bg-[#0B0B0F] border rounded-lg text-white focus:ring-2 outline-none transition-all ${errors.username ? "border-red-500 focus:ring-red-500/20" : "border-white/10 focus:ring-blue-500/20"}`}
                        disabled={!!initialData}
                     />
                     {errors.username && (
                        <p className="text-red-500 text-xs mt-1">
                           {errors.username.message}
                        </p>
                     )}
                  </div>

                  {/* Password - Only required for new users */}
                  <div className="relative">
                     <label className="block text-sm font-medium text-gray-400 mb-1">
                        Mật khẩu{" "}
                        {initialData ? "(Để trống nếu không đổi)" : "*"}
                     </label>
                     <div className="relative">
                        <input
                           type={showPassword ? "text" : "password"}
                           {...register("password")}
                           className={`w-full px-4 py-2 bg-[#0B0B0F] border rounded-lg text-white focus:ring-2 outline-none transition-all ${errors.password ? "border-red-500 focus:ring-red-500/20" : "border-white/10 focus:ring-blue-500/20"}`}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                           {showPassword ? (
                              <EyeOff size={18} />
                           ) : (
                              <Eye size={18} />
                           )}
                        </button>
                     </div>
                     {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                           {errors.password.message}
                        </p>
                     )}
                  </div>

                  {/* Name */}
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1">
                        Họ tên *
                     </label>
                     <input
                        {...register("name")}
                        className="w-full px-4 py-2 bg-[#0B0B0F] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                     />
                     {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                           {errors.name.message}
                        </p>
                     )}
                  </div>

                  {/* Email */}
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1">
                        Email *
                     </label>
                     <input
                        {...register("email")}
                        className="w-full px-4 py-2 bg-[#0B0B0F] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                     />
                     {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                           {errors.email.message}
                        </p>
                     )}
                  </div>

                  {/* Phone */}
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1">
                        Số điện thoại *
                     </label>
                     <input
                        {...register("phone")}
                        className="w-full px-4 py-2 bg-[#0B0B0F] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                     />
                     {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                           {errors.phone.message}
                        </p>
                     )}
                  </div>

                  {/* Branch */}
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1">
                        Chi nhánh *
                     </label>
                     <NativeSelect {...register("branchId")} className="w-full">
                        <NativeSelectOption value="">
                           Chọn chi nhánh
                        </NativeSelectOption>
                        <NativeSelectOption value="00000000-0000-0000-0000-000000000001">
                           CineMain HCM
                        </NativeSelectOption>
                        <NativeSelectOption value="00000000-0000-0000-0000-000000000002">
                           CineMain HN
                        </NativeSelectOption>
                     </NativeSelect>
                     {errors.branchId && (
                        <p className="text-red-500 text-xs mt-1">
                           {errors.branchId.message}
                        </p>
                     )}
                  </div>
               </div>

               {/* Roles - Multi select checkbox */}
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                     Vai trò *
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-3 border border-white/10 rounded-lg bg-black/20">
                     {roles.map((role) => (
                        <label
                           key={role.id}
                           className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
                        >
                           <input
                              type="checkbox"
                              value={role.id}
                              {...register("roleIds")}
                              className="w-4 h-4 text-blue-600 rounded bg-[#0B0B0F] border-white/10"
                           />
                           <span className="text-sm text-gray-300">
                              {role.name}
                           </span>
                        </label>
                     ))}
                  </div>
                  {errors.roleIds && (
                     <p className="text-red-500 text-xs mt-1">
                        {errors.roleIds.message}
                     </p>
                  )}
               </div>
            </form>

            <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3">
               <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
               >
                  Hủy
               </button>
               <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
               >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {initialData ? "Cập nhật" : "Tạo mới"}
               </button>
            </div>
         </div>
      </div>
   );
};

export default UserModal;
