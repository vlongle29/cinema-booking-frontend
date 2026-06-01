import type { FilterField } from "@/features/dashboard/shared/DashboardEntityList";
import type { SysRoleResponse } from "@/types/role";

export const getUserFilters = (roles: SysRoleResponse[]): FilterField[] => [
   {
      name: "username",
      label: "Tên đăng nhập",
      type: "text",
      placeholder: "Nhập username...",
   },
   {
      name: "email",
      label: "Email",
      type: "text",
      placeholder: "Nhập email...",
   },
   {
      name: "phone",
      label: "Số điện thoại",
      type: "text",
      placeholder: "Nhập số điện thoại...",
   },
   {
      name: "roleIds",
      label: "Vai trò",
      type: "select",
      options: roles.map((r) => ({ value: r.id, label: r.name })),
      placeholder: "Tất cả vai trò",
   },
   {
      name: "lockFlag",
      label: "Trạng thái",
      type: "select",
      options: [
         { value: "NORMAL", label: "Đang hoạt động" },
         { value: "LOCK", label: "Đã khóa" },
      ],
      placeholder: "Tất cả trạng thái",
   },
];
