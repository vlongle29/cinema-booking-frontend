import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-hot-toast";
import { employeeService } from "@/services/employeeService";
import type { Employee, EmployeeSearchDTO } from "@/types/employee";
import useAuth from "@/features/auth/hooks/useAuth";
import { useAuthz } from "@/hooks/useAuthz";

export function useStaffManagement() {
   const { userInfo } = useAuth();
   const { hasRole } = useAuthz();
   const isManager = hasRole("MANAGER") && !hasRole("SUPER_ADMIN");
   const [isCreating, setIsCreating] = useState(false);
   const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
      null,
   );
   const [employees, setEmployees] = useState<Employee[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [transferTarget, setTransferTarget] = useState<Employee | null>(null);

   const [searchParams, setSearchParams] = useState<EmployeeSearchDTO>(() => {
      const initialParams: EmployeeSearchDTO = { page: 1, size: 10 };
      if (isManager && userInfo?.id) {
         initialParams.manageId = userInfo.id;
      }
      return initialParams;
   });
   const [totalElements, setTotalElements] = useState(0);
   const [totalPages, setTotalPages] = useState(0);

   const debouncedSearchParams = useDebounce(searchParams, 500);

   const fetchEmployees = useCallback(async () => {
      setIsLoading(true);
      try {
         const response = await employeeService.search(debouncedSearchParams);
         if (response.success) {
            const rows = response.data.content;
            setEmployees(rows as unknown as Employee[]);
            setTotalElements(response.data.totalElements);
            setTotalPages(response.data.totalPages);
         }
      } catch {
         toast.error("Không thể tải danh sách nhân sự");
      } finally {
         setIsLoading(false);
      }
   }, [debouncedSearchParams]);

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
      setSearchParams((prev) => ({ 
         page: 1, 
         size: 10, 
         roleId: prev.roleId,
         manageId: isManager && userInfo?.id ? userInfo.id : undefined
      }));
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
         if (branchId === "UNASSIGN" || !branchId) {
            const res = await employeeService.update(userId, { branchId: null as any });
            if (res.success) {
               toast.success("Đã gỡ nhân sự khỏi chi nhánh thành công");
               setTransferTarget(null);
               fetchEmployees();
            }
         } else {
            const res = await employeeService.transfer(userId, { branchId });
            if (res.success) {
               toast.success("Chuyển chi nhánh thành công");
               setTransferTarget(null);
               fetchEmployees();
            }
         }
      } catch (error: any) {
         toast.error(
            error.response?.data?.message ||
               error.message ||
               "Không thể thực hiện thao tác",
         );
      }
   };

   const handleDelete = async (employeeId: string, employeeName: string) => {
      const confirmed = window.confirm(
         `Bạn có chắc chắn muốn xoá nhân sự "${employeeName}" không?\nHành động này sẽ vô hiệu hoá tài khoản và không thể đăng nhập.`,
      );
      if (!confirmed) return;

      try {
         await employeeService.deactivate(employeeId);
         toast.success(`Đã xoá nhân sự "${employeeName}" thành công`);
         fetchEmployees();
      } catch (error: any) {
         toast.error(
            error.response?.data?.message ||
               error.message ||
               "Không thể xoá nhân sự",
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
         handleDelete,
      },
   };
}
