import React, { useMemo, useState } from "react";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import CityForm from "./CityForm";
import { getCityColumns } from "./CityTableConfig";
import { useDashboardCity } from "../../hooks/useDashboardCity";
import { getCityFilters } from "./config/cityFilters";
import { dashboardCityService } from "@/features/dashboard/services/dashboard.city.service";
import { toast } from "react-hot-toast";

export default function CityManagementPage() {
   const { state, actions } = useDashboardCity();
   const [selectedIds, setSelectedIds] = useState<string[]>([]);
   const [isBulkDeleting, setIsBulkDeleting] = useState(false);

   const handleBulkDelete = async (ids: string[]) => {
      if (
         !window.confirm(
            `Bạn có chắc chắn muốn xóa ${ids.length} thành phố đã chọn?`
         )
      )
         return;

      setIsBulkDeleting(true);
      try {
         await Promise.allSettled(ids.map((id) => dashboardCityService.delete(id)));
         toast.success(`Đã xóa ${ids.length} thành phố thành công`);
         setSelectedIds([]);
         actions.handleFormSuccess();
      } catch {
         toast.error("Có lỗi xảy ra khi xóa thành phố");
      } finally {
         setIsBulkDeleting(false);
      }
   };

   const permissions = useMemo(
      () => ({
         canDelete: true,
         canUpdate: true,
         canCreate: true,
      }),
      []
   );

   const columns = useMemo(
      () =>
         getCityColumns({
            onEdit: actions.startEditing,
            onDelete: actions.handleDelete,
            permissions,
         }),
      [actions, permissions]
   );

   return (
      <DashboardEntityList
         title="Thành phố"
         entityName="thành phố"
         isCreating={state.isCreating}
         onToggleCreating={actions.toggleCreating}
         // Filters & Search
         filters={getCityFilters()}
         searchParams={state.searchParams}
         onSearchChange={(name, value) =>
            actions.handleSearchChange(name as any, value)
         }
         onResetFilters={actions.handleResetFilters}
         // Data & Table
         data={state.cities}
         columns={columns}
         isLoading={state.isLoading}
         selection={{
            selectedIds,
            onSelectionChange: setSelectedIds,
            onBulkDelete: handleBulkDelete,
            isDeleting: isBulkDeleting,
         }}
         // Pagination
         pagination={{
            currentPage: state.searchParams.page,
            pageSize: state.searchParams.size,
            totalElements: state.totalElements,
            totalPages: state.totalPages,
         }}
         onPageChange={actions.handlePageChange}
         // Form
         renderCreateForm={() => (
            <CityForm
               initialData={state.editingCity}
               onCancel={() => actions.setIsCreating(false)}
               onSuccess={actions.handleFormSuccess}
            />
         )}
      />
   );
}
