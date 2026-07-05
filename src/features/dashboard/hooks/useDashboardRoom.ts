import { useState, useEffect, useCallback } from "react";
import { roomService } from "@/features/dashboard/services/dashboard.room.service";
import type { Room, RoomSearchDTO } from "@/types/room";
import toast from "react-hot-toast";

export function useDashboardRoom() {
   const [isCreating, setIsCreating] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [editingRoom, setEditingRoom] = useState<Room | null>(null);
   const [rooms, setRooms] = useState<Room[]>([]);
   const [isLoading, setIsLoading] = useState(false);

   const [searchParams, setSearchParams] = useState<RoomSearchDTO>({
      page: 1,
      size: 10,
   });
   const [totalElements, setTotalElements] = useState(0);
   const [totalPages, setTotalPages] = useState(0);

   const fetchRooms = useCallback(async () => {
      setIsLoading(true);
      try {
         const response = await roomService.search(searchParams);
         setRooms(response.data.content);
         setTotalElements(response.data.totalElements);
         setTotalPages(response.data.totalPages);
      } catch (error) {
         console.error("Lỗi khi tải danh sách phòng chiếu:", error);
      } finally {
         setIsLoading(false);
      }
   }, [searchParams]);

   useEffect(() => {
      fetchRooms();
   }, [fetchRooms]);

   // --- ACTIONS ---

   const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa phòng chiếu này?")) {
         try {
            await roomService.delete(id);
            toast.success("Xóa phòng chiếu thành công");
            fetchRooms();
         } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa phòng chiếu");
         }
      }
   };

   const handleSearchChange = (name: keyof RoomSearchDTO, value: any) => {
      setSearchParams((prev) => ({ ...prev, [name]: value, page: 1 }));
   };

   const handleResetFilters = () => {
      setSearchParams({ page: 1, size: 10 });
   };

   const handlePageChange = (page: number) => {
      setSearchParams((prev) => ({ ...prev, page }));
   };

   const toggleCreating = () => {
      setIsCreating((prev) => {
         if (prev) setEditingRoom(null);
         return !prev;
      });
   };

   const toggleEditing = () => {
      setIsEditing((prev) => {
         if (prev) setEditingRoom(null);
         return !prev;
      });
   };

   const startEditing = (room: Room) => {
      setEditingRoom(room);
      setIsEditing(true);
   };

   const handleFormSuccess = () => {
      setIsCreating(false);
      setIsEditing(false);
      setEditingRoom(null);
      fetchRooms();
   };

   return {
      state: {
         rooms,
         isLoading,
         searchParams,
         totalElements,
         totalPages,
         isCreating,
         isEditing,
         editingRoom,
      },
      actions: {
         handleDelete,
         handleSearchChange,
         handleResetFilters,
         handlePageChange,
         toggleCreating,
         toggleEditing,
         startEditing,
         handleFormSuccess,
         setIsCreating,
      },
   };
}
