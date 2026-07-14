import {
   Edit2,
   EllipsisVertical,
   Building2,
   Briefcase,
   ArrowRightLeft,
} from "lucide-react";
import type { Employee } from "@/types/employee";
import type {
   Column,
   FilterField,
} from "@/features/dashboard/shared/DashboardEntityList";
import RoleBadge from "@/features/dashboard/domains/user/RoleBadge";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const formatSalary = (salary?: number) => {
   if (salary == null) return "—";
   return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
   }).format(salary);
};

export const getStaffColumns = (handlers: {
   onEdit: (employee: Employee) => void;
   onTransfer: (employee: Employee) => void;
   permissions: { canUpdate: boolean; canTransfer: boolean };
}): Column<Employee>[] => [
   {
      id: "employee",
      label: "Nhân sự",
      render: (employee) => (
         <div>
            <div className="font-medium text-white">{employee.name}</div>
            <div className="text-xs text-[#797b7d]">
               {employee.employeeCode} · @{employee.username}
            </div>
         </div>
      ),
   },
   {
      id: "contact",
      label: "Liên hệ",
      render: (employee) => (
         <div>
            <div className="text-sm text-[#d1d5dc]">{employee.email}</div>
            <div className="text-xs text-[#797b7d]">{employee.phone}</div>
         </div>
      ),
   },
   {
      id: "branch",
      label: "Chi nhánh",
      render: (employee) => (
         <div className="flex items-center gap-1.5 text-xs text-[#d1d5dc]">
            {/* <Building2 size={12} className="text-rose-500" /> */}
            {employee.branchName || "—"}
         </div>
      ),
   },
   // {
   //    id: "position",
   //    label: "Chức vụ",
   //    render: (employee) => (
   //       <div className="flex items-center gap-1.5 text-xs text-[#d1d5dc]">
   //          <Briefcase size={12} className="text-blue-400" />
   //          {employee.positionName || "—"}
   //       </div>
   //    ),
   // },
   {
      id: "role",
      label: "Vai trò",
      render: (employee) =>
         employee.roles ? (
            // <RoleBadge name={employee.roles?.[0].name} code={employee.roles?.[0].code} />
            <span className="text-sm text-[#d1d5dc]">{employee.roles?.[0].name}</span>
         ) : (
            <span className="text-xs text-[#797b7d]">STAFF</span>
         ),
   },
   {
      id: "actions",
      label: "Thao tác",
      align: "right",
      render: (employee) => (
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
               {handlers.permissions.canUpdate && (
                  <DropdownMenuItem
                     onClick={() => handlers.onEdit(employee)}
                     className="cursor-pointer hover:bg-white/5"
                  >
                     <Edit2 size={14} className="mr-2 text-blue-400" />
                     <span>Sửa thông tin</span>
                  </DropdownMenuItem>
               )}
               {handlers.permissions.canTransfer && (
                  <DropdownMenuItem
                     onClick={() => handlers.onTransfer(employee)}
                     className="cursor-pointer hover:bg-white/5"
                  >
                     <ArrowRightLeft
                        size={14}
                        className="mr-2 text-orange-400"
                     />
                     <span>Chuyển chi nhánh</span>
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];

export const getStaffFilters = (
   branchOptions: { value: string; label: string }[] = [],
   roleOptions: { value: string; label: string }[] = [],
): FilterField[] => [
   {
      name: "name",
      label: "Họ tên",
      type: "text",
      placeholder: "Tìm theo tên...",
   },
   {
      name: "employeeCode",
      label: "Mã nhân viên",
      type: "text",
      placeholder: "Mã NV...",
   },
   {
      name: "branchId",
      label: "Chi nhánh",
      type: "select",
      options: branchOptions,
      placeholder: "Tất cả chi nhánh",
   },
   {
      name: "roleId",
      label: "Vai trò",
      type: "select",
      options: roleOptions,
      placeholder: "Tất cả vai trò",
   },
];
