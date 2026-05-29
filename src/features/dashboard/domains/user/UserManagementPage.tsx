// 👉 Đặt tại: src/features/dashboard/domains/user/components/UserManagementPage.tsx
import React, { useMemo } from "react";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import ConfirmDialog from "@/components/common/ConfirmDiaglog";
import { getUserColumns, getUserFilters } from "./UserTableConfig";
import UserModal from "./UserModal";
import type { UserInfoResponse } from "@/types/user";
import { UserBulkActions, useUserManagement } from "./index";

const UserManagementPage: React.FC = () => {
   // 1. Lấy toàn bộ logic từ custom hook
   const { state, setters, handlers } = useUserManagement();

   // 2. Lấy cấu hình filters
   const filterFields = useMemo(
      () => getUserFilters(state.roles),
      [state.roles],
   );

   // 3. Cấu hình columns
   const columns = useMemo(
      () =>
         getUserColumns({
            onEdit: (user) => setters.setModal({ open: true, user }),
            onToggleLock: (user) =>
               setters.setConfirm({
                  open: true,
                  type: user.lockFlag === "0" ? "lock" : "unlock",
                  user,
               }),
            onDelete: (user) =>
               setters.setConfirm({ open: true, type: "delete", user }),
            onResetPass: handlers.handleResetPass,
         }),
      [setters, handlers],
   );

   return (
      <>
         <DashboardEntityList<UserInfoResponse>
            title="Người dùng"
            entityName="người dùng"
            isCreating={state.isCreating}
            onToggleCreating={() => setters.setIsCreating(!state.isCreating)}
            filters={filterFields}
            searchParams={state.searchParams}
            onSearchChange={handlers.handleSearchChange}
            onResetFilters={handlers.resetFilters}
            data={state.data?.content || []}
            columns={columns}
            isLoading={state.loading}
            selection={{
               selectedIds: state.selectedIds,
               onSelectionChange: setters.setSelectedIds,
            }}
            pagination={{
               totalPages: state.data?.totalPages || 0,
               totalElements: state.data?.totalElements || 0,
               currentPage: state.searchParams.pageNumber + 1,
               pageSize: state.searchParams.pageSize,
            }}
            onPageChange={(page) =>
               setters.setSearchParams((p) => ({ ...p, pageNumber: page - 1 }))
            }
            // --- XUẤT FORM CREATE ---
            renderCreateForm={() => (
               <div className="bg-[#1a1a1e] rounded-xl overflow-hidden">
                  <UserModal
                     isOpen={true}
                     roles={state.roles}
                     loading={state.actionLoading}
                     onClose={() => setters.setIsCreating(false)}
                     onSubmit={handlers.handleSaveUser}
                  />
               </div>
            )}
            // --- XUẤT BULK ACTIONS LÊN TRÊN BẢNG ---
            renderTopContent={() => (
               <UserBulkActions
                  selectedCount={state.selectedIds.length}
                  onLock={() =>
                     setters.setConfirm({
                        open: true,
                        type: "bulk-lock",
                        user: null,
                     })
                  }
                  onUnlock={() =>
                     setters.setConfirm({
                        open: true,
                        type: "bulk-unlock",
                        user: null,
                     })
                  }
                  onDelete={() =>
                     setters.setConfirm({
                        open: true,
                        type: "bulk-delete",
                        user: null,
                     })
                  }
               />
            )}
         />

         {/* --- CÁC MODAL ĐI KÈM --- */}
         {state.modal.user && (
            <UserModal
               isOpen={state.modal.open}
               initialData={state.modal.user}
               roles={state.roles}
               loading={state.actionLoading}
               onClose={() => setters.setModal({ open: false, user: null })}
               onSubmit={handlers.handleSaveUser}
            />
         )}

         <ConfirmDialog
            isOpen={state.confirm.open}
            title={
               state.confirm.type?.includes("delete")
                  ? "Xác nhận xóa"
                  : "Xác nhận thay đổi"
            }
            message={
               state.confirm.user
                  ? `Bạn có chắc chắn muốn ${state.confirm.type === "delete" ? "xóa" : state.confirm.type === "lock" ? "khóa" : "mở khóa"} người dùng ${state.confirm.user.name}?`
                  : `Bạn có chắc muốn thực hiện hành động này trên ${state.selectedIds.length} người dùng đã chọn?`
            }
            loading={state.actionLoading}
            onClose={() =>
               setters.setConfirm({ open: false, type: null, user: null })
            }
            onConfirm={handlers.handleConfirmAction}
         />
      </>
   );
};

export default UserManagementPage;
