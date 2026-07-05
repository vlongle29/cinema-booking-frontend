import apiService from "../../../services/apiService";
import type { ApiResponse } from "../../../services/apiService";
import type { Room, RoomRequest, RoomSearchDTO } from "@/types/room";

const ROOM_API_PATH = "/room";

export const roomService = {
   create: (data: RoomRequest) => {
      return apiService.post<ApiResponse<Room>>(ROOM_API_PATH, data);
   },

   getById: (id: string) => {
      return apiService.get<ApiResponse<Room>>(`${ROOM_API_PATH}/${id}`);
   },

   update: (id: string, data: RoomRequest) => {
      return apiService.put<ApiResponse<Room>>(`${ROOM_API_PATH}/${id}`, data);
   },

   delete: (id: string) => {
      return apiService.delete<ApiResponse<void>>(`${ROOM_API_PATH}/${id}`);
   },

   deleteCascade: (id: string) => {
      return apiService.delete<ApiResponse<void>>(`${ROOM_API_PATH}/${id}/cascade`);
   },

   restore: (id: string) => {
      return apiService.put<ApiResponse<Room>>(`${ROOM_API_PATH}/${id}/restore`);
   },

   getAll: () => {
      return apiService.get<ApiResponse<Room[]>>(ROOM_API_PATH);
   },

   search: (params: RoomSearchDTO) => {
      return apiService.get<ApiResponse<any>>(`${ROOM_API_PATH}/search`, {
         params,
      });
   },
};
