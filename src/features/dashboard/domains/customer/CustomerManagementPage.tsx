import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import CustomerForm from "./CustomerForm";
import {
   getCustomerColumns,
   getCustomerFilters,
} from "./config/CustomerTableConfig";
import { useCustomerManagement } from "../../hooks/useCustomerManagement";
import { useAuthz } from "@/hooks/useAuthz";

export default function CustomerManagementPage() {
   const { state, actions } = useCustomerManagement();
   const { customerPermissions } = useAuthz();

   if (!customerPermissions.canView) {
      return <Navigate to="/" replace />;
   }

   const permissions = useMemo(
      () => ({
         canUpdate: customerPermissions.canUpdate,
         canDelete: customerPermissions.canDelete,
      }),
      [customerPermissions],
   );

   const columns = useMemo(
      () =>
         getCustomerColumns({
            onEdit: actions.startEditing,
            onDelete: actions.handleDelete,
            permissions,
         }),
      [actions, permissions],
   );

   const filters = useMemo(() => getCustomerFilters(), []);

   return (
      <DashboardEntityList
         title="Khách hàng"
         entityName="khách hàng"
         canCreate={customerPermissions.canCreate}
         isCreating={state.isCreating}
         onToggleCreating={actions.toggleCreating}
         isEditing={false}
         onToggleEditing={() => {}}
         filters={filters}
         searchParams={state.searchParams}
         onSearchChange={actions.handleSearchChange}
         onResetFilters={actions.handleResetFilters}
         data={state.customers}
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
            <CustomerForm
               initialData={state.editingCustomer}
               onCancel={() => actions.setIsCreating(false)}
               onSuccess={actions.handleFormSuccess}
            />
         )}
         renderEditForm={() => null}
      />
   );
}
