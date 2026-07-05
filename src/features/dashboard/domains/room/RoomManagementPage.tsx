import React, { useMemo, useEffect, useState } from "react";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import RoomForm from "./RoomForm";
import RoomDetailDialog from "./RoomDetailDialog";
import { getRoomColumns } from "./RoomTableConfig";
import { useDashboardRoom } from "../../hooks/useDashboardRoom";
import { getRoomFilters } from "./config/roomFilters";
import { branchService } from "@/features/dashboard/services/dashboard.branch.service";
import useAuth from "@/features/auth/hooks/useAuth";
import type { Room } from "@/types/room";

export default function RoomManagementPage() {
   const { state, actions } = useDashboardRoom();
   const { userInfo } = useAuth();

   const [branchOptions, setBranchOptions] = useState<
      { value: string; label: string }[]
   >([]);

   const [viewingRoom, setViewingRoom] = useState<Room | null>(null);

   useEffect(() => {
      const fetchBranches = async () => {
         try {
            const res = await branchService.search({
               managerId: userInfo?.id,
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
            filters={getRoomFilters(branchOptions)}
            searchParams={state.searchParams}
            onSearchChange={actions.handleSearchChange}
            onResetFilters={actions.handleResetFilters}
            // Data & Table
            data={state.rooms}
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
