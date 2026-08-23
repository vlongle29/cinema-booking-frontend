import type { FilterField } from "@/features/dashboard/shared/DashboardEntityList";

export const getCityFilters = (): FilterField[] => [
   {
      name: "keyword",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Tên hoặc mã thành phố...",
   },
];
