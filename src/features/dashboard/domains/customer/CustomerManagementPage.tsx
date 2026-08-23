import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import CustomerForm from "./CustomerForm";
import {
   getCustomerColumns,
   getCustomerFilters,
} from "./config/CustomerTableConfig";
import { useCustomerManagement } from "../../hooks/useCustomerManagement";
import { useAuthz } from "@/hooks/useAuthz";
import { customerService } from "@/services/customerService";
import { toast } from "react-hot-toast";

export default function CustomerManagementPage() {
   const { state, actions } = useCustomerManagement();
   const { customerPermissions } = useAuthz();
   const [selectedIds, setSelectedIds] = useState<string[]>([]);
   const [isBulkDeleting, setIsBulkDeleting] = useState(false);

   const handleBulkDelete = async (ids: string[]) => {
      if (!window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} khách hàng đã chọn?`))
         return;

      setIsBulkDeleting(true);
      try {
         await Promise.allSettled(ids.map((id) => customerService.delete(id)));
         toast.success(`Đã xóa ${ids.length} khách hàng thành công`);
         setSelectedIds([]);
         actions.handleFormSuccess();
      } catch {
         toast.error("Có lỗi xảy ra khi xóa khách hàng");
      } finally {
         setIsBulkDeleting(false);
      }
   };

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
         selection={{
            selectedIds,
            onSelectionChange: setSelectedIds,
            onBulkDelete: handleBulkDelete,
            isDeleting: isBulkDeleting,
         }}
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
