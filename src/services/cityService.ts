import apiService from './apiService';

const CITY_API_PATH = '/cities';

export const cityService = {
   /**
    * Lấy danh sách thành phố
    */
   getAllCities: (params?: any) => {
      return apiService.get(CITY_API_PATH, { params });
   },

   /**
    * Xem chi tiết thành phố
    */
   getCityById: (id: string) => {
      return apiService.get(`${CITY_API_PATH}/${id}`);
   },

   /**
    * Thêm thành phố mới
    */
   createCity: (data: any) => {
      return apiService.post(CITY_API_PATH, data);
   },

   /**
    * Cập nhật thông tin thành phố
    */
   updateCity: (id: string, data: any) => {
      return apiService.put(`${CITY_API_PATH}/${id}`, data);
   },

   /**   
    * Xoá tĩnh/mềm thành phố
    */
   deleteCity: (id: string) => {
      return apiService.delete(`${CITY_API_PATH}/${id}`);
   },

   /**
    * Tìm kiếm thành phố
    */
   searchCity: (data: any) => {
      return apiService.post(`${CITY_API_PATH}/search`, data);
   }
};
