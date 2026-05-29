import React from "react";
import { Search, RotateCcw } from "lucide-react";
import type { SysRoleResponse } from "@/types/role";

interface UserSearchFormProps {
   onSearch: (values: any) => void;
   onReset: () => void;
   roles: SysRoleResponse[];
}

const UserSearchForm: React.FC<UserSearchFormProps> = ({
   onSearch,
   onReset,
   roles,
}) => {
   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      // Xử lý roleIds từ select multiple nếu cần, ở đây giả định select đơn giản
      onSearch({
         ...data,
         roleIds: data.roleIds || undefined,
      });
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
         <input
            name="username"
            placeholder="Tên đăng nhập..."
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm"
         />
         <input
            name="email"
            placeholder="Email..."
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm"
         />
         <input
            name="phone"
            placeholder="Số điện thoại..."
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm"
         />
         <select
            name="roleIds"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
         >
            <option value="">Vai trò (Tất cả)</option>
            {roles.map((role) => (
               <option key={role.id} value={role.id}>
                  {role.name}
               </option>
            ))}
         </select>
         <select
            name="lockFlag"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
         >
            <option value="">Trạng thái (Tất cả)</option>
            <option value="UNLOCK">Đang hoạt động (UNLOCK)</option>
            <option value="LOCK">Đã khóa (LOCK)</option>
         </select>

         <div className="flex gap-2">
            <button
               type="submit"
               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
               <Search size={18} />
               <span>Tìm</span>
            </button>
            <button
               type="reset"
               onClick={onReset}
               className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
               title="Reset"
            >
               <RotateCcw size={18} />
            </button>
         </div>
      </form>
   );
};

export default UserSearchForm;
