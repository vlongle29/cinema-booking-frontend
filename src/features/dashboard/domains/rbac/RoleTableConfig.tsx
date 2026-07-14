import { Edit2, Trash2, Shield, EllipsisVertical } from "lucide-react";
import type { SysRole } from "@/types/rbac";
import type { Column, FilterField } from "@/features/dashboard/shared/DashboardEntityList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const getRoleColumns = (handlers: {
  onEdit: (role: SysRole) => void;
  onDelete: (id: string) => void;
  onAssign: (role: SysRole) => void;
}): Column<SysRole>[] => [
  {
    id: "code",
    label: "Mã vai trò",
    render: (role) => (
      <span className="font-mono text-xs bg-[#252529] text-[#f84565] px-2 py-0.5 rounded">
        {role.code}
      </span>
    ),
  },
  {
    id: "name",
    label: "Tên vai trò",
    render: (role) => (
      <span className="font-medium text-white">{role.name}</span>
    ),
  },
  {
    id: "description",
    label: "Mô tả",
    render: (role) => (
      <span className="text-sm text-[#797b7d]">{role.description || "—"}</span>
    ),
  },
  {
    id: "createTime",
    label: "Ngày tạo",
    render: (role) =>
      role.createTime ? (
        <span className="text-xs text-[#797b7d]">
          {new Date(role.createTime).toLocaleDateString("vi-VN")}
        </span>
      ) : (
        <span className="text-xs text-[#555]">—</span>
      ),
  },
  {
    id: "actions",
    label: "Thao tác",
    align: "right",
    render: (role) => (
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
          className="w-52 bg-[#1a1a1e] border-white/10 text-gray-300"
        >
          <DropdownMenuItem
            onClick={() => handlers.onAssign(role)}
            className="cursor-pointer hover:bg-white/5"
          >
            <Shield size={14} className="mr-2 text-violet-400" />
            <span>Phân quyền</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlers.onEdit(role)}
            className="cursor-pointer hover:bg-white/5"
          >
            <Edit2 size={14} className="mr-2 text-blue-400" />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            onClick={() => handlers.onDelete(role.id)}
            className="cursor-pointer hover:bg-white/5 text-rose-400 focus:text-rose-400"
          >
            <Trash2 size={14} className="mr-2" />
            <span>Xóa vai trò</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export const getRoleFilters = (): FilterField[] => [
  {
    name: "name",
    label: "Tên vai trò",
    type: "text",
    placeholder: "Tìm theo tên...",
  },
  {
    name: "code",
    label: "Mã vai trò",
    type: "text",
    placeholder: "Tìm theo mã...",
  },
];
