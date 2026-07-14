import { useMemo, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import StaffForm from "./StaffForm";
import TransferStaffDialog from "./TransferStaffDialog";
import {
   getStaffColumns,
   getStaffFilters,
} from "./config/StaffTableConfig";
import { useStaffManagement } from "../../hooks/useStaffManagement";
import { useAuthz } from "@/hooks/useAuthz";
import { branchService } from "@/features/dashboard/services/dashboard.branch.service";
import { positionService } from "@/services/positionService";
import { roleService } from "@/services/roleService";

export default function StaffManagementPage() {
   const { state, actions } = useStaffManagement();
   const { staffPermissions } = useAuthz();

   const [branchOptions, setBranchOptions] = useState<
      { value: string; label: string }[]
   >([]);
   const [positionOptions, setPositionOptions] = useState<
      { value: string; label: string }[]
   >([]);
   const [roleOptions, setRoleOptions] = useState<
      { value: string; label: string }[]
   >([]);

   useEffect(() => {
      const fetchOptions = async () => {
         try {
            const [branchRes, positionRes, roleRes] = await Promise.all([
               branchService.getAll(),
               positionService.getAll(),
               roleService.getAllRoles(),
            ]);

            const branchList = (branchRes?.data as any)?.content || branchRes?.data || [];
            setBranchOptions(
               branchList.map((b: any) => ({
                  value: b.id,
                  label: b.name,
               }))
            );

            const positionList = (positionRes?.data as any)?.content || positionRes?.data || [];
            setPositionOptions(
               positionList.map((p: any) => ({
                  value: p.id,
                  label: p.name,
               }))
            );

            const roleList = (roleRes?.data as any)?.content || roleRes?.data || [];
            setRoleOptions(
               roleList.map((r: any) => ({
                  value: r.id,
                  label: r.name,
               }))
            );
         } catch (error) {
            console.error("Failed to fetch staff form options:", error);
         }
      };
      fetchOptions();
   }, []);

   if (!staffPermissions.canView) {
      return <Navigate to="/" replace />;
   }

   const permissions = useMemo(
      () => ({
         canUpdate: staffPermissions.canUpdate,
         canTransfer: staffPermissions.canTransfer,
      }),
      [staffPermissions],
   );

   const columns = useMemo(
      () =>
         getStaffColumns({
            onEdit: actions.startEditing,
            onTransfer: actions.setTransferTarget,
            permissions,
         }),
      [actions, permissions],
   );

   const filters = useMemo(
      () => getStaffFilters(branchOptions, roleOptions),
      [branchOptions, roleOptions],
   );

   return (
      <>
         <DashboardEntityList
            title="Nhân sự"
            entityName="nhân sự"
            canCreate={staffPermissions.canCreate}
            isCreating={state.isCreating}
            onToggleCreating={actions.toggleCreating}
            isEditing={false}
            onToggleEditing={() => {}}
            filters={filters}
            searchParams={state.searchParams}
            onSearchChange={actions.handleSearchChange}
            onResetFilters={actions.handleResetFilters}
            data={state.employees}
            columns={columns}
            isLoading={state.isLoading}
            pagination={{
               currentPage: state.searchParams.page || 1,
               pageSize: state.searchParams.size || 10,
               totalElements: state.totalElements,
               totalPages: state.totalPages,
            }}
            onPageChange={actions.handlePageChange}
            renderCreateForm={() => (
               <StaffForm
                  initialData={state.editingEmployee}
                  branchOptions={branchOptions}
                  positionOptions={positionOptions}
                  onCancel={() => actions.setIsCreating(false)}
                  onSuccess={actions.handleFormSuccess}
               />
            )}
            renderEditForm={() => null}
         />

         <TransferStaffDialog
            employee={state.transferTarget}
            branchOptions={branchOptions}
            onClose={() => actions.setTransferTarget(null)}
            onConfirm={actions.handleTransfer}
         />
      </>
   );
}
