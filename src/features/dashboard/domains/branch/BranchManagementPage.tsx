import React, { useState, useMemo, useEffect } from "react";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import BranchForm from "./BranchForm";
import { branchService } from "@/services/branchService";
import { getBranchColumns, getBranchFilters } from "./BranchTableConfig";
import type { Branch, BranchSearchDTO } from "@/types/branch";
import { useNavigate } from "react-router-dom";

export default function BranchManagementPage() {
   const navigate = useNavigate();
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

   // Giả định logic Role (Nên lấy từ AuthContext)
   const permissions = {
      canDelete: true, // SUPER_ADMIN
      canUpdate: true, // SUPER_ADMIN, ADMIN
      canCreate: true, // SUPER_ADMIN
   };

   const fetchBranches = async () => {
      setIsLoading(true);
      try {
         const response = await branchService.search(searchParams);
         setBranches(response.data.content);
         setTotalElements(response.data.totalElements);
         setTotalPages(response.data.totalPages);
      } catch (error) {
         console.error(error);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchBranches();
   }, [searchParams]);

   const columns = useMemo(
      () =>
         getBranchColumns({
            onEdit: (branch) => {
               setEditingBranch(branch);
               setIsCreating(true);
            },
            onDelete: async (id) => {
               if (window.confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) {
                  await branchService.delete(id);
                  fetchBranches();
               }
            },
            onViewDetail: (id) => navigate(`/dashboard/branches/${id}`),
            onViewRooms: (id) =>
               navigate(`/dashboard/branches/${id}?tab=rooms`),
            permissions,
         }),
      [],
   );

   return (
      <DashboardEntityList
         title="Chi nhánh"
         entityName="chi nhánh"
         isCreating={isCreating}
         onToggleCreating={() => {
            setIsCreating(!isCreating);
            if (isCreating) setEditingBranch(null);
         }}
         filters={getBranchFilters()}
         searchParams={searchParams}
         onSearchChange={(name, value) =>
            setSearchParams((prev) => ({ ...prev, [name]: value, page: 1 }))
         }
         onResetFilters={() => setSearchParams({ page: 1, size: 10 })}
         data={branches}
         columns={columns}
         isLoading={isLoading}
         pagination={{
            currentPage: searchParams.page,
            pageSize: searchParams.size,
            totalElements,
            totalPages,
         }}
         onPageChange={(page) => setSearchParams((prev) => ({ ...prev, page }))}
         renderCreateForm={() => (
            <BranchForm
               initialData={editingBranch}
               onCancel={() => setIsCreating(false)}
               onSuccess={() => {
                  setIsCreating(false);
                  fetchBranches();
               }}
            />
         )}
      />
   );
}
