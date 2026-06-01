import React from "react";
import {
   Edit2,
   Trash2,
   Lock,
   Unlock,
   ShieldCheck,
   EllipsisVertical,
   RotateCcw,
} from "lucide-react";
import type { UserInfoResponse } from "@/types/user";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type {
   Column,
   FilterField,
} from "@/features/dashboard/shared/DashboardEntityList";
import type { SysRoleResponse } from "@/types/role";

export const getUserColumns = (handlers: {
   onEdit: (user: UserInfoResponse) => void;
   onToggleLock: (user: UserInfoResponse) => void;
   onDelete: (user: UserInfoResponse) => void;
   onResetPass: (user: UserInfoResponse) => void;
}): Column<UserInfoResponse>[] => [
   {
      id: "user",
      label: "Người dùng",
      render: (user) => (
         <div className="flex items-center gap-3">
            <img
               src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=random`
               }
               className="w-10 h-10 rounded-full object-cover border border-[#393939] shadow-sm"
               alt={user.name}
            />
            <div>
               <div className="font-medium text-white flex items-center gap-1">
                  {user.name}
                  {user.systemFlag === "1" && (
                     <ShieldCheck
                        size={14}
                        className="text-blue-500"
                        title="Hệ thống"
                     />
                  )}
               </div>
               <div className="text-xs text-[#797b7d]">@{user.username}</div>
            </div>
         </div>
      ),
   },
   {
      id: "contact",
      label: "Liên hệ",
      render: (user) => (
         <div>
            <div className="text-sm text-[#d1d5dc]">{user.email}</div>
            <div className="text-xs text-[#797b7d]">{user.phone}</div>
         </div>
      ),
   },
   {
      id: "roles",
      label: "Vai trò",
      render: (user) => (
         <div className="flex flex-wrap gap-1">
            {user.roles.map((role) => (
               <RoleBadge key={role.id} name={role.name} code={role.code} />
            ))}
         </div>
      ),
   },
   {
      id: "status",
      label: "Trạng thái",
      render: (user) => <StatusBadge status={user.lockFlag} />,
   },
   {
      id: "actions",
      label: "Thao tác",
      align: "right",
      render: (user) => (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#797b7d] hover:text-[#f84565]"
               >
                  <EllipsisVertical size={18} />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               align="end"
               className="w-44 bg-[#1a1a1e] border-white/10 text-gray-300"
            >
               <DropdownMenuItem
                  onClick={() => handlers.onEdit(user)}
                  className="cursor-pointer hover:bg-white/5"
               >
                  <Edit2 size={14} className="mr-2 text-blue-400" />
                  <span>Sửa thông tin</span>
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => handlers.onResetPass(user)}
                  className="cursor-pointer hover:bg-white/5"
               >
                  <RotateCcw size={14} className="mr-2 text-yellow-400" />
                  <span>Reset mật khẩu</span>
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => handlers.onToggleLock(user)}
                  className="cursor-pointer hover:bg-white/5"
               >
                  {user.lockFlag === "0" ? (
                     <>
                        <Lock size={14} className="mr-2 text-orange-400" />
                        <span>Khóa tài khoản</span>
                     </>
                  ) : (
                     <>
                        <Unlock size={14} className="mr-2 text-emerald-400" />
                        <span>Mở khóa tài khoản</span>
                     </>
                  )}
               </DropdownMenuItem>
               <DropdownMenuSeparator className="bg-white/5" />
               <DropdownMenuItem
                  onClick={() => handlers.onDelete(user)}
                  className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
               >
                  <Trash2 size={14} className="mr-2" />
                  <span>Xóa người dùng</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];

export const getUserFilters = (roles: SysRoleResponse[]): FilterField[] => [
   {
      name: "username",
      label: "Tên đăng nhập",
      type: "text",
      placeholder: "Search username...",
   },
   {
      name: "email",
      label: "Email",
      type: "text",
      placeholder: "Search email...",
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
