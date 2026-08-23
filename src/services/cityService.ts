import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

export interface City {
   id: string;
   name: string;
   code: string;
   createTime?: string;
   updateTime?: string;
}

const CITY_API_PATH = "/cities";

export const cityService = {
   getAll: () => apiService.get<ApiResponse<City[]>>(CITY_API_PATH),

   search: (params?: { keyword?: string; page?: number; size?: number }) =>
      apiService.get<ApiResponse<any>>(`${CITY_API_PATH}/search`, { params }),

   getById: (id: string) =>
      apiService.get<ApiResponse<City>>(`${CITY_API_PATH}/${id}`),
};

