import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import BranchForm from "./BranchForm";
import { getBranchColumns, getBranchFilters } from "./BranchTableConfig";
import { useDashboardBranch } from "../../hooks/useDashboardBranch";

export default function BranchManagementPage() {
   const navigate = useNavigate();

   // Lấy state và actions từ Custom Hook
   const { state, actions } = useDashboardBranch();

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
         filters={getBranchFilters()}
         searchParams={state.searchParams}
         onSearchChange={actions.handleSearchChange}
         onResetFilters={actions.handleResetFilters}
         // Data & Table
         data={state.branches}
         columns={columns}
         isLoading={state.isLoading}
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
               initialData={state.editingBranch}
               onCancel={() => actions.setIsCreating(false)}
               onSuccess={actions.handleFormSuccess}
            />
         )}
      />
   );
}
