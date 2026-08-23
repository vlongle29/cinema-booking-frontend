import apiService from "../../../services/apiService";
import type { ApiResponse } from "../../../services/apiService";
import type { City, CityRequest, CitySearchDTO } from "@/types/city";

const CITY_API_PATH = "/cities";

export const dashboardCityService = {
   create: (data: CityRequest) => {
      return apiService.post<ApiResponse<City>>(CITY_API_PATH, data);
   },

   getById: (id: string) => {
      return apiService.get<ApiResponse<City>>(`${CITY_API_PATH}/${id}`);
   },

   update: (id: string, data: CityRequest) => {
      return apiService.put<ApiResponse<City>>(`${CITY_API_PATH}/${id}`, data);
   },

   delete: (id: string) => {
      return apiService.delete<ApiResponse<void>>(`${CITY_API_PATH}/${id}`);
   },

   search: (params: CitySearchDTO) => {
      return apiService.get<ApiResponse<any>>(`${CITY_API_PATH}/search`, {
         params,
      });
   },

   getAll: () => {
      return apiService.get<ApiResponse<City[]>>(CITY_API_PATH);
   },
};
