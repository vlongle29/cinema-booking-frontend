import apiService from "./apiService";
import type { ApiResponse, PageResponse } from "./apiService";
import type {
   EmployeeResponse,
   EmployeeCreateRequest,
   EmployeeUpdateRequest,
   EmployeeSearchDTO,
   TransferEmployeeRequest,
} from "@/types/employee";

const EMPLOYEE_API_PATH = "/employee";

export const employeeService = {
   search: (params: EmployeeSearchDTO) => {
      return apiService.get<ApiResponse<PageResponse<EmployeeResponse>>>(
         `${EMPLOYEE_API_PATH}/search`,
         { params },
      );
   },

   getById: (userId: string) => {
      return apiService.get<ApiResponse<EmployeeResponse>>(
         `${EMPLOYEE_API_PATH}/${userId}`,
      );
   },

   getByBranch: (branchId: string, page = 1, size = 100) => {
      return apiService.get<ApiResponse<PageResponse<EmployeeResponse>>>(
         `${EMPLOYEE_API_PATH}/branch/${branchId}`,
         { params: { page, size } },
      );
   },

   create: (data: EmployeeCreateRequest) => {
      return apiService.post<ApiResponse<EmployeeResponse>>(
         EMPLOYEE_API_PATH,
         data,
      );
   },

   update: (userId: string, data: EmployeeUpdateRequest) => {
      return apiService.put<ApiResponse<EmployeeResponse>>(
         `${EMPLOYEE_API_PATH}/${userId}`,
         data,
      );
   },

   transfer: (userId: string, data: TransferEmployeeRequest) => {
      return apiService.put<ApiResponse<EmployeeResponse>>(
         `${EMPLOYEE_API_PATH}/${userId}/transfer`,
         data,
      );
   },

   /** Legacy helper for dropdowns */
   getAllEmployees: () => {
      return employeeService.search({ page: 1, size: 100 });
   },
};
