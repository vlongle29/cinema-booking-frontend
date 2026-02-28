import apiService from './apiService';

const BRANCH_API_PATH = '/branch';

export const branchService = {
   /**
    * Lấy danh sách chi nhánh
    */
   getAllBranches: (params?: any) => {
      return apiService.get(BRANCH_API_PATH, { params });
   },

   /**
    * Xem chi tiết chi nhánh
    */
   getBranchById: (id: string) => {
      return apiService.get(`${BRANCH_API_PATH}/${id}`);
   },

   /**
    * Thêm chi nhánh mới
    */
   createBranch: (data: any) => {
      return apiService.post(BRANCH_API_PATH, data);
   },

   /**
    * Cập nhật thông tin chi nhánh
    */
   updateBranch: (id: string, data: any) => {
      return apiService.put(`${BRANCH_API_PATH}/${id}`, data);
   },

   /**   
    * Xoá tĩnh/mềm chi nhánh
    */
   deleteBranch: (id: string) => {
      return apiService.delete(`${BRANCH_API_PATH}/${id}`);
   },

   /**
    * Tìm kiếm chi nhánh
    */
   searchBranch: (data: any) => {
      return apiService.post(`${BRANCH_API_PATH}/search`, data);
   }
};
