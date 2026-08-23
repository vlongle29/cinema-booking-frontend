import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import BranchForm from "./BranchForm";
import { getBranchColumns } from "./BranchTableConfig";
import { useDashboardBranch } from "../../hooks/useDashboardBranch";
import { getBranchFilters } from "./config/branchFilters";
import { cityService } from "@/services/cityService";
import { employeeService } from "@/services/employeeService";


import { branchService } from "@/features/dashboard/services/dashboard.branch.service";
import { toast } from "react-hot-toast";

export default function BranchManagementPage() {
   const navigate = useNavigate();

   // Lấy state và actions từ Custom Hook
   const { state, actions } = useDashboardBranch();
   const [selectedIds, setSelectedIds] = useState<string[]>([]);
   const [isBulkDeleting, setIsBulkDeleting] = useState(false);

   const handleBulkDelete = async (ids: string[]) => {
      if (!window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} chi nhánh đã chọn?`))
         return;

      setIsBulkDeleting(true);
      try {
         await Promise.allSettled(ids.map((id) => branchService.delete(id)));
         toast.success(`Đã xóa ${ids.length} chi nhánh thành công`);
         setSelectedIds([]);
         actions.handleFormSuccess();
      } catch {
         toast.error("Có lỗi xảy ra khi xóa chi nhánh");
      } finally {
         setIsBulkDeleting(false);
      }
   };

   // State lưu trữ options thành phố
   const [cityOptions, setCityOptions] = useState<
      { value: string; label: string }[]
   >([]);
   const [managerOptions, setManagerOptions] = useState<
      { value: string; label: string }[]
   >([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [cityRes, empRes] = await Promise.all([
               cityService.getAll(),
               employeeService.search({ page: 1, size: 100 })
            ]);

            console.log("cityRes", cityRes);
            console.log("empRes", empRes);


            const cOptions = cityRes?.data?.map((city: any) => ({
               value: city.id,
               label: city.name,
            }));
            setCityOptions(cOptions);

            const mOptions = empRes?.data?.content?.map((emp: any) => ({
               value: emp.userId,
               label: `${emp.name} (${emp.employeeCode})`,
            })) || [];
            setManagerOptions(mOptions);
         } catch (error) {
            console.error("Failed to fetch options data:", error);
         }
      };
      fetchData();
   }, []);

   // Giả định logic Role (Nên lấy từ AuthContext trong thực tế)
   const permissions = useMemo(
      () => ({
         canDelete: true, // SUPER_ADMIN
         canUpdate: true, // SUPER_ADMIN, ADMIN
         canCreate: true, // SUPER_ADMIN
      }),
      [],
   );

   // Đã bổ sung dependency array đầy đủ để tránh lỗi stale closure
   const columns = useMemo(
      () =>
         getBranchColumns({
            onEdit: actions.startEditing,
            onDelete: actions.handleDelete,
            onViewDetail: (id) => navigate(`/dashboard/branches/${id}`),
            onViewRooms: (id) =>
               navigate(`/dashboard/branches/${id}?tab=rooms`),
            permissions,
         }),
      [navigate, actions, permissions],
   );

   return (
      <DashboardEntityList
         title="Chi nhánh"
         entityName="chi nhánh"
         isCreating={state.isCreating}
         onToggleCreating={actions.toggleCreating}
         // Filters & Search
         filters={getBranchFilters(cityOptions, managerOptions)}
         searchParams={state.searchParams}
         onSearchChange={(name, value) => actions.handleSearchChange(name as any, value)}
         onResetFilters={actions.handleResetFilters}
         // Data & Table
         data={state.branches}
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
         // Forms
         renderCreateForm={() => (
            <BranchForm
               cityOptions={cityOptions}
               managerOptions={managerOptions}
               initialData={state.editingBranch}
               onCancel={() => actions.setIsCreating(false)}
               onSuccess={actions.handleFormSuccess}
            />
         )}
      />
   );
}
