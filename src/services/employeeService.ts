import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

const EMPLOYEE_API_PATH = "/employee";

export const employeeService = {
   /**
    * Lấy danh sách nhân viên để chọn làm quản lý
    * Ở đây tôi dùng search với size lớn để lấy list cho dropdown
    */
   getAllEmployees: () => {
      return apiService.get<ApiResponse<any>>(`${EMPLOYEE_API_PATH}/search`, {
         params: { page: 0, size: 100 },
      });
   },
};
