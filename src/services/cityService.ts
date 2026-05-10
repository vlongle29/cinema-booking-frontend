import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

const CITY_API_PATH = "/cities";

export const cityService = {
   /**
    * Lấy danh sách thành phố
    */
   getAllCities: (params?: any) => {
      return apiService.get<ApiResponse<any>>(CITY_API_PATH, { params });
   },

   /**
    * Xem chi tiết thành phố
    */
   getCityById: (id: string) => {
      return apiService.get<ApiResponse<any>>(`${CITY_API_PATH}/${id}`);
   },

   /**
    * Thêm thành phố mới
    */
   createCity: (data: any) => {
      return apiService.post<ApiResponse<any>>(CITY_API_PATH, data);
   },

   /**
    * Cập nhật thông tin thành phố
    */
   updateCity: (id: string, data: any) => {
      return apiService.put<ApiResponse<any>>(`${CITY_API_PATH}/${id}`, data);
   },

   /**
    * Xoá tĩnh/mềm thành phố
    */
   deleteCity: (id: string) => {
      return apiService.delete<ApiResponse<any>>(`${CITY_API_PATH}/${id}`);
   },

   /**
    * Tìm kiếm thành phố
    */
   searchCity: (data: any) => {
      return apiService.post<ApiResponse<any>>(`${CITY_API_PATH}/search`, data);
   },
};
