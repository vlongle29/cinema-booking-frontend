import apiService from "../../../services/apiService";
import type { ApiResponse } from "../../../services/apiService";
import type { Branch, BranchRequest, BranchSearchDTO } from "@/types/branch";

const BRANCH_API_PATH = "/branch";

export const branchService = {
   create: (data: BranchRequest) => {
      return apiService.post<ApiResponse<Branch>>(BRANCH_API_PATH, data);
   },

   getById: (id: string) => {
      return apiService.get<ApiResponse<Branch>>(`${BRANCH_API_PATH}/${id}`);
   },

   update: (id: string, data: BranchRequest) => {
      return apiService.put<ApiResponse<Branch>>(
         `${BRANCH_API_PATH}/${id}`,
         data,
      );
   },

   delete: (id: string) => {
      return apiService.delete<ApiResponse<void>>(`${BRANCH_API_PATH}/${id}`);
   },

   deleteCascade: (id: string) => {
      return apiService.delete<ApiResponse<void>>(
         `${BRANCH_API_PATH}/${id}/cascade`,
      );
   },

   search: (params: BranchSearchDTO) => {
      return apiService.get<ApiResponse<any>>(`${BRANCH_API_PATH}/search`, {
         params,
      });
   },

   getAll: () => {
      return apiService.get<ApiResponse<Branch[]>>(BRANCH_API_PATH);
   },

   getRoomsByBranch: (branchId: string) => {
      return apiService.get<ApiResponse<any[]>>(
         `${BRANCH_API_PATH}/${branchId}/rooms`,
      );
   },

   restore: (id: string) => {
      return apiService.put<ApiResponse<Branch>>(
         `${BRANCH_API_PATH}/${id}/restore`,
      );
   },
};
