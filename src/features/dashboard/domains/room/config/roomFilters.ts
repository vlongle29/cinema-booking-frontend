import type { FilterField } from "@/features/dashboard/shared/DashboardEntityList";

export const getRoomFilters = (
   branchOptions: { value: string; label: string }[] = [],
): FilterField[] => [
   {
      name: "name",
      label: "Tên phòng",
      type: "text",
      placeholder: "Tìm tên phòng...",
   },
   {
      name: "branchId",
      label: "Chi nhánh",
      type: "select",
      options: branchOptions,
      placeholder: "Tất cả chi nhánh",
   },
   {
      name: "isDeleted",
      label: "Trạng thái",
      type: "select",
      options: [
         { value: "false", label: "Đang hoạt động" },
         { value: "true", label: "Đã xóa" },
      ],
      placeholder: "Tất cả trạng thái",
   },
];
