import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import BranchForm from "./BranchForm";
import { getBranchColumns } from "./BranchTableConfig";
import { useDashboardBranch } from "../../hooks/useDashboardBranch";
import { getBranchFilters } from "./config/branchFilters";
import { cityService } from "@/services/cityService";
import { employeeService } from "@/services/employeeService";

export default function BranchManagementPage() {
   const navigate = useNavigate();

   // Lấy state và actions từ Custom Hook
   const { state, actions } = useDashboardBranch();

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
            const [cityRes] = await Promise.all([
               cityService.getAll(),
              
            ]);

            console.log("city data", cityRes);
            

            const cOptions = cityRes.data.map((city: any) => ({
               value: city.id,
               label: city.name,
            }));
            setCityOptions(cOptions);

            const mOptions = empRes.data.data.content.map((emp: any) => ({
               value: emp.userId,
               label: `${emp.name} (${emp.employeeCode})`,
            }));
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
