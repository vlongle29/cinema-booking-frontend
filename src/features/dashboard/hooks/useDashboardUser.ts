// 👉 Đặt tại: src/features/dashboard/domains/user/hooks/useUserManagement.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { userService } from "@/services/userService";
import { roleService } from "@/services/roleService";
import type { UserInfoResponse, SysUserSearchDTO } from "@/types/user";
import type { UserFormValues } from "@/utils/validationUtil";
import type { SysRoleResponse } from "@/types/role";
import type { PageResponse } from "@/services/apiService";

export const useUserManagement = () => {
   // 1. States
   const [data, setData] = useState<PageResponse<UserInfoResponse> | null>(
      null,
   );
   const [roles, setRoles] = useState<SysRoleResponse[]>([]);
   const [loading, setLoading] = useState(false);
   const [actionLoading, setActionLoading] = useState(false);
   const [isCreating, setIsCreating] = useState(false);
   const [selectedIds, setSelectedIds] = useState<string[]>([]);

   const [searchParams, setSearchParams] = useState<SysUserSearchDTO>({
      pageNumber: 0,
      pageSize: 10,
      sortBy: "createTime",
      sortDirection: "DESC",
   });

   const [modal, setModal] = useState<{
      open: boolean;
      user: UserInfoResponse | null;
   }>({ open: false, user: null });
   const [confirm, setConfirm] = useState<{
      open: boolean;
      type:
         | "delete"
         | "lock"
         | "unlock"
         | "bulk-delete"
         | "bulk-lock"
         | "bulk-unlock"
         | null;
      user: UserInfoResponse | null;
   }>({ open: false, type: null, user: null });

   // 2. Fetch Data
   const fetchUsers = useCallback(async () => {
      setLoading(true);
      try {
         const response = await userService.getAllUsers(searchParams);
         if (response.success) {
            setData(response.data);
            setSelectedIds([]);
         }
      } catch (error) {
         toast.error("Không thể tải danh sách người dùng");
      } finally {
         setLoading(false);
      }
   }, [searchParams]);

   const fetchRoles = useCallback(async () => {
      try {
         const response = await roleService.getAllRoles();
         const rolesData = Array.isArray(response)
            ? response
            : "data" in response && Array.isArray(response.data)
              ? response.data
              : [];
         setRoles(rolesData);
      } catch (e) {
         console.error(e);
      }
   }, []);

   useEffect(() => {
      fetchRoles();
   }, [fetchRoles]);

   useEffect(() => {
      fetchUsers();
   }, [fetchUsers]);

   // 3. Handlers
   const handleSearchChange = useCallback((name: string, value: any) => {
      setSearchParams((prev) => {
         return {
            ...prev,
            [name]: value === "" ? undefined : value,
            pageNumber: 0, // Reset về trang 1 khi lọc
         };
      });
   }, []);

   const resetFilters = () => {
      setSearchParams({
         pageNumber: 0,
         pageSize: 10,
         sortBy: "createTime",
         sortDirection: "DESC",
         username: undefined,
         email: undefined,
         phone: undefined,
         lockFlag: undefined,
         roleIds: undefined,
      });
   };

   const handleSaveUser = async (values: UserFormValues) => {
      setActionLoading(true);
      try {
         const payload = {
            ...values,
            branchId: values.branchId || "00000000-0000-0000-0000-000000000000",
         };
         const apiCall = modal.user
            ? userService.updateUser(modal.user.id, payload as any)
            : userService.createUser(payload as any);
         const res = await apiCall;

         if (res.success) {
            toast.success(
               modal.user ? "Cập nhật thành công" : "Tạo mới thành công",
            );
            modal.user
               ? setModal({ open: false, user: null })
               : setIsCreating(false);
            fetchUsers();
         }
      } catch (error: any) {
         toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      } finally {
         setActionLoading(false);
      }
   };

   const handleConfirmAction = async () => {
      if (!confirm.type) return;
      setActionLoading(true);
      try {
         const ids = confirm.user ? [confirm.user.id] : selectedIds;
         let res;
         if (confirm.type.includes("delete"))
            res = await userService.deleteUser(ids);
         else if (
            confirm.type.includes("lock") &&
            !confirm.type.includes("unlock")
         )
            res = await userService.lockUsers({ ids });
         else res = await userService.unlockUsers({ ids });

         if (res.success) {
            toast.success(
               confirm.user
                  ? "Thao tác thành công"
                  : `Đã xử lý ${ids.length} người dùng`,
            );
            setConfirm({ open: false, type: null, user: null });
            setSelectedIds([]);
            fetchUsers();
         }
      } catch (error) {
         toast.error("Thao tác thất bại");
      } finally {
         setActionLoading(false);
      }
   };

   const handleResetPass = async (user: UserInfoResponse) => {
      try {
         await userService.resetUserPassword(user.email);
         toast.success(`Đã gửi email khôi phục đến ${user.email}`);
      } catch (e) {
         toast.error("Không thể gửi email reset password");
      }
   };

   return {
      state: {
         data,
         roles,
         loading,
         actionLoading,
         isCreating,
         selectedIds,
         searchParams,
         modal,
         confirm,
      },
      setters: {
         setIsCreating,
         setSelectedIds,
         setSearchParams,
         setModal,
         setConfirm,
      },
      handlers: {
         handleSearchChange,
         resetFilters,
         handleSaveUser,
         handleConfirmAction,
         handleResetPass,
      },
   };
};
