import type { FilterField } from "@/features/dashboard/shared/DashboardEntityList";

export const getBranchFilters = (
   cityOptions: { value: string; label: string }[] = [],
   managerOptions: { value: string; label: string }[] = [],
): FilterField[] => [
   {
      name: "name",
      label: "Tên chi nhánh",
      type: "text",
      placeholder: "Tìm tên...",
   },
   {
      name: "cityId",
      label: "Thành phố",
      type: "select",
      options: cityOptions,
      placeholder: "Tất cả thành phố",
   },
   {
      name: "managerId",
      label: "Quản lý",
      type: "select",
      options: managerOptions,
      placeholder: "Tất cả quản lý",
   },
];
