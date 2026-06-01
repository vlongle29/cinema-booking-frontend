import { useState, useEffect, useCallback } from "react";
import { branchService } from "@/features/dashboard/services/dashboard.branch.service";
import type { Branch, BranchSearchDTO } from "@/types/branch";

export function useDashboardBranch() {
   const [isCreating, setIsCreating] = useState(false);
   const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
   const [branches, setBranches] = useState<Branch[]>([]);
   const [isLoading, setIsLoading] = useState(false);

   const [searchParams, setSearchParams] = useState<BranchSearchDTO>({
      page: 1,
      size: 10,
   });
   const [totalElements, setTotalElements] = useState(0);
   const [totalPages, setTotalPages] = useState(0);

   // Dùng useCallback để tránh hàm bị tạo lại liên tục gây re-render
   const fetchBranches = useCallback(async () => {
      setIsLoading(true);
      try {
         const response = await branchService.search(searchParams);
         setBranches(response.data.content);
         setTotalElements(response.data.totalElements);
         setTotalPages(response.data.totalPages);
      } catch (error) {
         console.error("Lỗi khi tải danh sách chi nhánh:", error);
      } finally {
         setIsLoading(false);
      }
   }, [searchParams]);

   useEffect(() => {
      fetchBranches();
   }, [fetchBranches]);

   // --- CÁC HÀM XỬ LÝ ACTIONS ---

   const handleDelete = async (id: string | number) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) {
         await branchService.delete(id);
         fetchBranches();
      }
   };

   const handleSearchChange = (name: keyof BranchSearchDTO, value: any) => {
      setSearchParams((prev) => ({ ...prev, [name]: value, page: 1 }));
   };

   const handleResetFilters = () => {
      setSearchParams({ page: 1, size: 10 });
   };

   const handlePageChange = (page: number) => {
      setSearchParams((prev) => ({ ...prev, page }));
   };

   const toggleCreating = () => {
      setIsCreating((prev) => {
         const willClose = prev;
         if (willClose) setEditingBranch(null);
         return !prev;
      });
   };

   const startEditing = (branch: Branch) => {
      setEditingBranch(branch);
      setIsCreating(true);
   };

   const handleFormSuccess = () => {
      setIsCreating(false);
      fetchBranches();
   };

   return {
      state: {
         branches,
         isLoading,
         searchParams,
         totalElements,
         totalPages,
         isCreating,
         editingBranch,
      },
      actions: {
         handleDelete,
         handleSearchChange,
         handleResetFilters,
         handlePageChange,
         toggleCreating,
         startEditing,
         handleFormSuccess,
         setIsCreating, // Export thêm nếu cần dùng trực tiếp
      },
   };
}
