import { Edit2, Trash2, EllipsisVertical } from "lucide-react";
import type { SysPermission } from "@/types/rbac";
import type { Column, FilterField } from "@/features/dashboard/shared/DashboardEntityList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const getPermissionColumns = (handlers: {
  onEdit: (perm: SysPermission) => void;
  onDelete: (id: string) => void;
}): Column<SysPermission>[] => [
  {
    id: "permission",
    label: "Tên quyền",
    render: (perm) => (
      <span className="font-mono text-sm text-emerald-400">{perm.permission}</span>
    ),
  },
  {
    id: "description",
    label: "Mô tả",
    render: (perm) => (
      <span className="text-sm text-[#797b7d]">{perm.description || "—"}</span>
    ),
  },
  {
    id: "actions",
    label: "Thao tác",
    align: "right",
    render: (perm) => (
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
          className="w-48 bg-[#1a1a1e] border-white/10 text-gray-300"
        >
          <DropdownMenuItem
            onClick={() => handlers.onEdit(perm)}
            className="cursor-pointer hover:bg-white/5"
          >
            <Edit2 size={14} className="mr-2 text-blue-400" />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            onClick={() => handlers.onDelete(perm.id)}
            className="cursor-pointer hover:bg-white/5 text-rose-400 focus:text-rose-400"
          >
            <Trash2 size={14} className="mr-2" />
            <span>Xóa quyền</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export const getPermissionFilters = (): FilterField[] => [
  {
    name: "permission",
    label: "Tên quyền",
    type: "text",
    placeholder: "Tìm theo tên quyền...",
  },
];
