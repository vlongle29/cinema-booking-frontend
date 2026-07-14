import apiService from "./apiService";
import type { ApiResponse, PageResponse } from "./apiService";
import type {
   CustomerResponse,
   CustomerCreateRequest,
   CustomerUpdateRequest,
   CustomerSearchDTO,
} from "@/types/customer";

const CUSTOMER_API_PATH = "/customers";

export const customerService = {
   search: (params: CustomerSearchDTO) => {
      return apiService.get<ApiResponse<PageResponse<CustomerResponse>>>(
         `${CUSTOMER_API_PATH}/search`,
         { params },
      );
   },

   getById: (userId: string) => {
      return apiService.get<ApiResponse<CustomerResponse>>(
         `${CUSTOMER_API_PATH}/${userId}`,
      );
   },

   create: (data: CustomerCreateRequest) => {
      return apiService.post<ApiResponse<CustomerResponse>>(
         CUSTOMER_API_PATH,
         data,
      );
   },

   update: (userId: string, data: CustomerUpdateRequest) => {
      return apiService.put<ApiResponse<CustomerResponse>>(
         `${CUSTOMER_API_PATH}/${userId}`,
         data,
      );
   },

   delete: (userId: string) => {
      return apiService.delete<ApiResponse<void>>(
         `${CUSTOMER_API_PATH}/${userId}`,
      );
   },
};
