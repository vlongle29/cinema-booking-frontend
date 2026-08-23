import { useMemo, useState } from "react";
import { Shield, Key } from "lucide-react";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import { useDashboardRbac } from "@/features/dashboard/hooks/useDashboardRbac";
import RoleForm from "./RoleForm";
import AssignPermissionsDialog from "./AssignPermissionsDialog";
import PermissionPanel from "./PermissionPanel";
import { getRoleColumns, getRoleFilters } from "./RoleTableConfig";

type ActiveTab = "roles" | "permissions";

export default function RbacManagementPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("roles");
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const {
    roleState, roleActions,
    permissionState, permissionActions,
    assignState, assignActions,
  } = useDashboardRbac();

  const handleBulkDeleteRoles = async (ids: string[]) => {
    setIsBulkDeleting(true);
    try {
      await roleActions.handleDeleteRolesBatch(ids);
      setSelectedRoleIds([]);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const roleColumns = useMemo(
    () =>
      getRoleColumns({
        onEdit: roleActions.startEditingRole,
        onDelete: roleActions.handleDeleteRole,
        onAssign: assignActions.openAssignDialog,
      }),
    [roleActions, assignActions],
  );

  return (
    <div className="w-full space-y-4">
      {/* Page Header & Tab Switcher */}
      <div className="mt-2 mb-2 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-white">
          Quản lý{" "}
          <span className="text-[#f84565] underline decoration-[#f84565]">
            Vai trò &amp; Phân quyền
          </span>
        </h1>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#1a1a1e] border border-[#393939] rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab("roles")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "roles"
                ? "bg-[#f84565] text-white shadow-sm shadow-rose-500/25"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {/* <Shield size={13} /> */}
            Vai trò
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("permissions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "permissions"
                ? "bg-[#f84565] text-white shadow-sm shadow-rose-500/25"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {/* <Key size={13} /> */}
            Quyền hạn
          </button>
        </div>
      </div>

      {/* ROLE TAB */}
      {activeTab === "roles" && (
        <>
          <DashboardEntityList
            title="Vai trò"
            entityName="vai trò"
            canCreate={true}
            isCreating={roleState.isCreatingRole}
            onToggleCreating={roleActions.toggleCreatingRole}
            isEditing={roleState.isEditingRole}
            onToggleEditing={roleActions.toggleEditingRole}
            filters={getRoleFilters()}
            searchParams={roleState.roleSearchParams}
            onSearchChange={roleActions.handleRoleSearchChange}
            onResetFilters={roleActions.handleRoleResetFilters}
            data={roleState.roles}
            columns={roleColumns}
            isLoading={roleState.isLoadingRoles}
            selection={{
              selectedIds: selectedRoleIds,
              onSelectionChange: setSelectedRoleIds,
              onBulkDelete: handleBulkDeleteRoles,
              isDeleting: isBulkDeleting,
            }}
            pagination={{
              currentPage: roleState.roleSearchParams.page,
              pageSize: roleState.roleSearchParams.size,
              totalElements: roleState.roleTotalElements,
              totalPages: roleState.roleTotalPages,
            }}
            onPageChange={roleActions.handleRolePageChange}
            renderCreateForm={() => (
              <RoleForm
                initialData={null}
                onCancel={roleActions.toggleCreatingRole}
                onSuccess={roleActions.handleRoleFormSuccess}
              />
            )}
            renderEditForm={() => (
              <RoleForm
                initialData={roleState.editingRole}
                onCancel={roleActions.toggleEditingRole}
                onSuccess={roleActions.handleRoleFormSuccess}
              />
            )}
            emptyMessage="Không tìm thấy vai trò nào"
            loadingMessage="Đang tải danh sách vai trò..."
          />
          <AssignPermissionsDialog
            role={assignState.assigningRole}
            allPermissions={assignState.allPermissions}
            currentPermissions={assignState.rolePermissions}
            isLoading={assignState.isLoadingAssign}
            onClose={assignActions.closeAssignDialog}
            onSave={assignActions.handleSaveAssign}
          />
        </>
      )}

      {/* PERMISSION TAB */}
      {activeTab === "permissions" && (
        <div className="bg-[#1a1a1e] border border-[#393939] rounded-2xl p-5">
          <PermissionPanel
            permissions={permissionState.permissions}
            isLoading={permissionState.isLoadingPermissions}
            totalElements={permissionState.permissionTotalElements}
            totalPages={permissionState.permissionTotalPages}
            currentPage={permissionState.permissionSearchParams.page}
            onPageChange={permissionActions.handlePermissionPageChange}
            onSearchChange={permissionActions.handlePermissionSearchChange}
            onResetFilters={permissionActions.handlePermissionResetFilters}
            onDelete={permissionActions.handleDeletePermission}
            onDeleteBatch={permissionActions.handleDeletePermissionBatch}
            onFormSuccess={permissionActions.handlePermissionFormSuccess}
            editingPermission={permissionState.editingPermission}
            isCreatingPermission={permissionState.isCreatingPermission}
            isEditingPermission={permissionState.isEditingPermission}
            toggleCreatingPermission={permissionActions.toggleCreatingPermission}
            toggleEditingPermission={permissionActions.toggleEditingPermission}
            startEditingPermission={permissionActions.startEditingPermission}
          />
        </div>
      )}
    </div>
  );
}
