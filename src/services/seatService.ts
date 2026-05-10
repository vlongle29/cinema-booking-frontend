import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

const SEAT_API_PATH = "/seat";

export const seatService = {
   /**
    * Lấy danh sách ghế theo phòng chiếu
    */
   getSeatsByRoom: (roomId: string) => {
      return apiService.get<ApiResponse<any>>(
         `${SEAT_API_PATH}/room/${roomId}`,
      );
   },
};
