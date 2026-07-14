import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { userService } from "@/services/userService";
import type { Customer, CustomerSearchDTO } from "@/types/customer";
import { customerService } from "@/services/customerService";

export function useCustomerManagement() {
   const [isCreating, setIsCreating] = useState(false);
   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(
      null,
   );
   const [customers, setCustomers] = useState<Customer[]>([]);
   const [isLoading, setIsLoading] = useState(false);

   const [searchParams, setSearchParams] = useState<CustomerSearchDTO>({
      page: 1,
      size: 10,
      roleIds: ["67d80f2f-adaf-47ae-a6b5-934339a29e03"],
   });
   const [totalElements, setTotalElements] = useState(0);
   const [totalPages, setTotalPages] = useState(0);

   const fetchCustomers = useCallback(async () => {
      setIsLoading(true);
      try {
         const response = await customerService.search(searchParams);
         if (response.success) {
            const rows = response.data.content;
            setCustomers(rows);
            setTotalElements(response.data.totalElements);
            setTotalPages(response.data.totalPages);
         }
      } catch (error: any) {
         toast.error(error.response?.data?.message || "Không thể tải danh sách");
      } finally {
         setIsLoading(false);
      }
   }, [searchParams]);

   useEffect(() => {
      fetchCustomers();
   }, [fetchCustomers]);

   const handleDelete = async (userId: string) => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) return;
      try {
         const res = await customerService.delete(userId);
         if (res.success) {
            toast.success("Đã xóa khách hàng");
            fetchCustomers();
         }
      } catch (error: any) {
         toast.error(
            error.response?.data?.message || "Không thể xóa khách hàng",
         );
      }
   };

   const handleSearchChange = (name: string, value: any) => {
      setSearchParams((prev) => ({
         ...prev,
         [name]: value === "" ? undefined : value,
         page: 1,
      }));
   };

   const handleResetFilters = () => {
      setSearchParams((prev) => ({ page: 1, size: 10, roleIds: prev.roleIds }));
   };

   const handlePageChange = (page: number) => {
      setSearchParams((prev) => ({ ...prev, page }));
   };

   const toggleCreating = () => {
      setIsCreating((prev) => {
         if (prev) setEditingCustomer(null);
         return !prev;
      });
   };

   const startEditing = (customer: Customer) => {
      setEditingCustomer(customer);
      setIsCreating(true);
   };

   const handleFormSuccess = () => {
      setIsCreating(false);
      setEditingCustomer(null);
      fetchCustomers();
   };

   return {
      state: {
         customers,
         isLoading,
         searchParams,
         totalElements,
         totalPages,
         isCreating,
         editingCustomer,
      },
      actions: {
         handleDelete,
         handleSearchChange,
         handleResetFilters,
         handlePageChange,
         toggleCreating,
         startEditing,
         handleFormSuccess,
         setIsCreating,
      },
   };
}
