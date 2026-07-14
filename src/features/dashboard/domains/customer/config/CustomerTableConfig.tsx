import {
   Edit2,
   Trash2,
   EllipsisVertical,
   MapPin,
   Star,
} from "lucide-react";
import type { Customer } from "@/types/customer";
import type {
   Column,
   FilterField,
} from "@/features/dashboard/shared/DashboardEntityList";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const MEMBERSHIP_LABELS: Record<string, string> = {
   BRONZE: "Đồng",
   SILVER: "Bạc",
   GOLD: "Vàng",
   PLATINUM: "Bạch kim",
};

const MEMBERSHIP_COLORS: Record<string, string> = {
   BRONZE: "bg-amber-50 text-amber-700 border-amber-100",
   SILVER: "bg-slate-50 text-slate-600 border-slate-200",
   GOLD: "bg-yellow-50 text-yellow-700 border-yellow-100",
   PLATINUM: "bg-violet-50 text-violet-700 border-violet-100",
};

const GENDER_LABELS: Record<string, string> = {
   MALE: "Nam",
   FEMALE: "Nữ",
   OTHER: "Khác",
};

export const getCustomerColumns = (handlers: {
   onEdit: (customer: Customer) => void;
   onDelete: (userId: string) => void;
   permissions: { canUpdate: boolean; canDelete: boolean };
}): Column<Customer>[] => [
   {
      id: "customer",
      label: "Khách hàng",
      render: (customer) => (
         <div>
            <div className="font-medium text-white">{customer.name}</div>
            <div className="text-xs text-[#797b7d]">@{customer.username}</div>
         </div>
      ),
   },
   {
      id: "contact",
      label: "Liên hệ",
      render: (customer) => (
         <div>
            <div className="text-sm text-[#d1d5dc]">{customer.email}</div>
            <div className="text-xs text-[#797b7d]">{customer.phone}</div>
         </div>
      ),
   },
   // {
   //    id: "location",
   //    label: "Địa chỉ",
   //    render: (customer) => (
   //       <div className="text-xs text-[#797b7d]">
   //          {customer.city && (
   //             <div className="flex items-center gap-1">
   //                <MapPin size={10} className="text-rose-500" />
   //                {customer.city}
   //             </div>
   //          )}
   //          {customer.address && (
   //             <div className="mt-0.5 truncate max-w-[180px]">
   //                {customer.address}
   //             </div>
   //          )}
   //       </div>
   //    ),
   // },
   {
      id: "membership",
      label: "Hạng thành viên",
      render: (customer) => {
         const level = customer.membershipLevel || "BRONZE";
         return (
            <div className="flex flex-col gap-1">
               <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase w-fit ${MEMBERSHIP_COLORS[level] || MEMBERSHIP_COLORS.BRONZE}`}
               >
                  <Star size={10} />
                  {MEMBERSHIP_LABELS[level] || level}
               </span>
               {customer.loyaltyPoints != null && (
                  <span className="text-[10px] text-[#797b7d]">
                     {customer.loyaltyPoints} điểm
                  </span>
               )}
            </div>
         );
      },
   },
   {
      id: "gender",
      label: "Giới tính",
      render: (customer) => (
         <span className="text-xs text-[#d1d5dc]">
            {customer.gender
               ? GENDER_LABELS[customer.gender] || customer.gender
               : "—"}
         </span>
      ),
   },
   {
      id: "actions",
      label: "Thao tác",
      align: "right",
      render: (customer) => (
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
               {handlers.permissions.canUpdate && (
                  <DropdownMenuItem
                     onClick={() => handlers.onEdit(customer)}
                     className="cursor-pointer hover:bg-white/5"
                  >
                     <Edit2 size={14} className="mr-2 text-blue-400" />
                     <span>Sửa thông tin</span>
                  </DropdownMenuItem>
               )}
               {handlers.permissions.canDelete && (
                  <DropdownMenuItem
                     onClick={() => handlers.onDelete(customer.userId)}
                     className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
                  >
                     <Trash2 size={14} className="mr-2" />
                     <span>Xóa khách hàng</span>
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];

export const getCustomerFilters = (): FilterField[] => [
   {
      name: "keyword",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Tên, email, số điện thoại...",
   },
   {
      name: "membershipLevel",
      label: "Hạng thành viên",
      type: "select",
      options: [
         { value: "BRONZE", label: "Đồng" },
         { value: "SILVER", label: "Bạc" },
         { value: "GOLD", label: "Vàng" },
         { value: "PLATINUM", label: "Bạch kim" },
      ],
      placeholder: "Tất cả hạng",
   },
   {
      name: "city",
      label: "Thành phố",
      type: "text",
      placeholder: "Lọc theo thành phố...",
   },
];
