import React, { useMemo, useEffect, useState } from "react";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import RoomForm from "./RoomForm";
import RoomDetailDialog from "./RoomDetailDialog";
import { getRoomColumns } from "./RoomTableConfig";
import { useDashboardRoom } from "../../hooks/useDashboardRoom";
import { getRoomFilters } from "./config/roomFilters";
import { branchService } from "@/features/dashboard/services/dashboard.branch.service";
import { roomService } from "@/features/dashboard/services/dashboard.room.service";
import useAuth from "@/features/auth/hooks/useAuth";
import { useAuthz } from "@/hooks/useAuthz";
import type { Room } from "@/types/room";
import { toast } from "react-hot-toast";

export default function RoomManagementPage() {
   const { state, actions } = useDashboardRoom();
   const { userInfo } = useAuth();
   const { hasRole } = useAuthz();
   const isManager = hasRole("MANAGER") && !hasRole("SUPER_ADMIN");
   const [selectedIds, setSelectedIds] = useState<string[]>([]);
   const [isBulkDeleting, setIsBulkDeleting] = useState(false);

   const handleBulkDelete = async (ids: string[]) => {
      if (!window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} phòng chiếu đã chọn?`))
         return;

      setIsBulkDeleting(true);
      try {
         await Promise.allSettled(ids.map((id) => roomService.delete(id)));
         toast.success(`Đã xóa ${ids.length} phòng chiếu thành công`);
         setSelectedIds([]);
         actions.handleFormSuccess();
      } catch {
         toast.error("Có lỗi xảy ra khi xóa phòng chiếu");
      } finally {
         setIsBulkDeleting(false);
      }
   };

   const [branchOptions, setBranchOptions] = useState<
      { value: string; label: string }[]
   >([]);

   const [viewingRoom, setViewingRoom] = useState<Room | null>(null);

   useEffect(() => {
      const fetchBranches = async () => {
         try {
            const res = await branchService.search({
               ...(isManager && userInfo?.id ? { managerId: userInfo.id } : {}),
               page: 1,
               size: 100,
            });
            const options = res?.data?.content?.map((branch: any) => ({
               value: branch.id,
               label: branch.name,
            })) || [];
            setBranchOptions(options);
         } catch (error) {
            console.error("Lỗi khi tải danh sách chi nhánh:", error);
         }
      };
      fetchBranches();
   }, [userInfo?.id]);

   const permissions = useMemo(
      () => ({
         canDelete: true,
         canUpdate: true,
         canCreate: true,
      }),
      [],
   );

   const columns = useMemo(
      () =>
         getRoomColumns({
            onEdit: actions.startEditing,
            onDelete: actions.handleDelete,
            onViewDetail: (room) => setViewingRoom(room),
            permissions,
         }),
      [actions, permissions],
   );

   return (
      <>
         <DashboardEntityList
            title="Phòng chiếu"
            entityName="phòng chiếu"
            // Create dialog
            isCreating={state.isCreating}
            onToggleCreating={actions.toggleCreating}
            // Edit dialog
            isEditing={state.isEditing}
            onToggleEditing={actions.toggleEditing}
            // Filters & Search
            filters={getRoomFilters(branchOptions, isManager)}
            searchParams={state.searchParams}
            onSearchChange={(name, value) => actions.handleSearchChange(name as any, value)}
            onResetFilters={actions.handleResetFilters}
            // Data & Table
            data={state.rooms}
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
               <RoomForm
                  branchOptions={branchOptions}
                  initialData={null}
                  onCancel={actions.toggleCreating}
                  onSuccess={actions.handleFormSuccess}
               />
            )}
            renderEditForm={() => (
               <RoomForm
                  branchOptions={branchOptions}
                  initialData={state.editingRoom}
                  onCancel={actions.toggleEditing}
                  onSuccess={actions.handleFormSuccess}
               />
            )}
            emptyMessage="Không tìm thấy phòng chiếu nào"
            loadingMessage="Đang tải danh sách phòng chiếu..."
         />

         <RoomDetailDialog
            room={viewingRoom}
            open={!!viewingRoom}
            onClose={() => setViewingRoom(null)}
         />
      </>
   );
}
