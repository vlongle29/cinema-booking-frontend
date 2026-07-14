import apiService from "./apiService";
import type { ApiResponse } from "./apiService";
import type { PositionResponse } from "@/types/position";

const POSITION_API_PATH = "/positions";

export const positionService = {
   getAll: () => {
      return apiService.get<ApiResponse<PositionResponse[]>>(POSITION_API_PATH);
   },
};
