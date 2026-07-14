import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { employeeService } from "@/services/employeeService";
import type { Employee, EmployeeSearchDTO } from "@/types/employee";
import { userService } from "@/services/userService";

export function useStaffManagement() {
   const [isCreating, setIsCreating] = useState(false);
   const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
      null,
   );
   const [employees, setEmployees] = useState<Employee[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [transferTarget, setTransferTarget] = useState<Employee | null>(null);

   const [searchParams, setSearchParams] = useState<EmployeeSearchDTO>({
      page: 1,
      size: 10,
   });
   const [totalElements, setTotalElements] = useState(0);
   const [totalPages, setTotalPages] = useState(0);

   const fetchEmployees = useCallback(async () => {
      setIsLoading(true);
      try {
         const response = await employeeService.search(searchParams);
         if (response.success) {
            const rows = response.data.content;
            setEmployees(rows);
            setTotalElements(response.data.totalElements);
            setTotalPages(response.data.totalPages);
         }
      } catch {
         toast.error("Không thể tải danh sách nhân sự");
      } finally {
         setIsLoading(false);
      }
   }, [searchParams]);

   useEffect(() => {
      fetchEmployees();
   }, [fetchEmployees]);

   const handleSearchChange = (name: string, value: any) => {
      setSearchParams((prev) => ({
         ...prev,
         [name]: value === "" ? undefined : value,
         page: 1,
      }));
   };

   const handleResetFilters = () => {
      setSearchParams((prev) => ({ page: 1, size: 10, roleId: prev.roleId }));
   };

   const handlePageChange = (page: number) => {
      setSearchParams((prev) => ({ ...prev, page }));
   };

   const toggleCreating = () => {
      setIsCreating((prev) => {
         if (prev) setEditingEmployee(null);
         return !prev;
      });
   };

   const startEditing = (employee: Employee) => {
      setEditingEmployee(employee);
      setIsCreating(true);
   };

   const handleFormSuccess = () => {
      setIsCreating(false);
      setEditingEmployee(null);
      fetchEmployees();
   };

   const handleTransfer = async (userId: string, branchId: string) => {
      try {
         const res = await employeeService.transfer(userId, { branchId });
         if (res.success) {
            toast.success("Chuyển chi nhánh thành công");
            setTransferTarget(null);
            fetchEmployees();
         }
      } catch (error: any) {
         toast.error(
            error.response?.data?.message || "Không thể chuyển chi nhánh",
         );
      }
   };

   return {
      state: {
         employees,
         isLoading,
         searchParams,
         totalElements,
         totalPages,
         isCreating,
         editingEmployee,
         transferTarget,
      },
      actions: {
         handleSearchChange,
         handleResetFilters,
         handlePageChange,
         toggleCreating,
         startEditing,
         handleFormSuccess,
         setIsCreating,
         setTransferTarget,
         handleTransfer,
      },
   };
}
