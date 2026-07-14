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
  const {
    roleState, roleActions,
    permissionState, permissionActions,
    assignState, assignActions,
  } = useDashboardRbac();

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
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="mt-2 mb-2 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-violet-500/20 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
          <Shield size={22} className="text-[#f84565]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">
            Quản lý Vai trò &amp;{" "}
            <span className="text-[#f84565] underline decoration-[#f84565]">Phân quyền</span>
          </h1>
          <p className="text-sm text-[#797b7d] mt-0.5">
            Quản lý các vai trò hệ thống và gán quyền hạn tương ứng
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-[#1a1a1e] border border-[#393939] rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "roles"
              ? "bg-[#f84565] text-white shadow-lg shadow-rose-500/25"
              : "text-[#797b7d] hover:text-white hover:bg-white/5"
          }`}
        >
          <Shield size={15} /> Vai trò
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "permissions"
              ? "bg-[#f84565] text-white shadow-lg shadow-rose-500/25"
              : "text-[#797b7d] hover:text-white hover:bg-white/5"
          }`}
        >
          <Key size={15} /> Quyền hạn
        </button>
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
