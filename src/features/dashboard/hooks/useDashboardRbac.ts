import { useState, useEffect, useCallback } from "react";
import { sysRoleService, sysPermissionService } from "@/features/dashboard/services/dashboard.rbac.service";
import type {
  SysRole,
  SysRoleSearchDTO,
  SysPermission,
  SysPermissionSearchDTO,
} from "@/types/rbac";
import toast from "react-hot-toast";

export function useDashboardRbac() {
  // ────────────────────────────── ROLE STATE ──────────────────────────────
  const [roles, setRoles] = useState<SysRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editingRole, setEditingRole] = useState<SysRole | null>(null);
  const [roleSearchParams, setRoleSearchParams] = useState<SysRoleSearchDTO>({
    page: 1,
    size: 10,
  });
  const [roleTotalElements, setRoleTotalElements] = useState(0);
  const [roleTotalPages, setRoleTotalPages] = useState(0);

  // ───────────────────────── PERMISSION STATE ─────────────────────────────
  const [permissions, setPermissions] = useState<SysPermission[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isCreatingPermission, setIsCreatingPermission] = useState(false);
  const [isEditingPermission, setIsEditingPermission] = useState(false);
  const [editingPermission, setEditingPermission] = useState<SysPermission | null>(null);
  const [permissionSearchParams, setPermissionSearchParams] =
    useState<SysPermissionSearchDTO>({ page: 1, size: 10 });
  const [permissionTotalElements, setPermissionTotalElements] = useState(0);
  const [permissionTotalPages, setPermissionTotalPages] = useState(0);

  // ───────────────────── ASSIGN DIALOG STATE ──────────────────────────────
  const [assigningRole, setAssigningRole] = useState<SysRole | null>(null);
  const [rolePermissions, setRolePermissions] = useState<SysPermission[]>([]);
  const [allPermissions, setAllPermissions] = useState<SysPermission[]>([]);
  const [isLoadingAssign, setIsLoadingAssign] = useState(false);

  // ────────────────────────── FETCH ROLES ─────────────────────────────────
  const fetchRoles = useCallback(async () => {
    setIsLoadingRoles(true);
    try {
      const res = await sysRoleService.search(roleSearchParams);
      setRoles(res.data?.content ?? []);
      setRoleTotalElements(res.data?.totalElements ?? 0);
      setRoleTotalPages(res.data?.totalPages ?? 0);
    } catch (err) {
      console.error("Lỗi tải danh sách vai trò:", err);
    } finally {
      setIsLoadingRoles(false);
    }
  }, [roleSearchParams]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // ──────────────────────── FETCH PERMISSIONS ─────────────────────────────
  const fetchPermissions = useCallback(async () => {
    setIsLoadingPermissions(true);
    try {
      const res = await sysPermissionService.search(permissionSearchParams);
      setPermissions(res.data?.content ?? []);
      setPermissionTotalElements(res.data?.totalElements ?? 0);
      setPermissionTotalPages(res.data?.totalPages ?? 0);
    } catch (err) {
      console.error("Lỗi tải danh sách quyền:", err);
    } finally {
      setIsLoadingPermissions(false);
    }
  }, [permissionSearchParams]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // ────────────────────────── ROLE ACTIONS ────────────────────────────────
  const handleDeleteRole = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vai trò này?")) return;
    try {
      await sysRoleService.deleteRoles([id]);
      toast.success("Xóa vai trò thành công");
      fetchRoles();
    } catch {
      toast.error("Xóa vai trò thất bại");
    }
  };

  const handleRoleSearchChange = (name: string, value: any) => {
    setRoleSearchParams((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleRoleResetFilters = () => {
    setRoleSearchParams({ page: 1, size: 10 });
  };

  const handleRolePageChange = (page: number) => {
    setRoleSearchParams((prev) => ({ ...prev, page }));
  };

  const toggleCreatingRole = () => {
    setIsCreatingRole((prev) => {
      if (prev) setEditingRole(null);
      return !prev;
    });
  };

  const toggleEditingRole = () => {
    setIsEditingRole((prev) => {
      if (prev) setEditingRole(null);
      return !prev;
    });
  };

  const startEditingRole = (role: SysRole) => {
    setEditingRole(role);
    setIsEditingRole(true);
  };

  const handleRoleFormSuccess = () => {
    setIsCreatingRole(false);
    setIsEditingRole(false);
    setEditingRole(null);
    fetchRoles();
  };

  // ──────────────────────── PERMISSION ACTIONS ────────────────────────────
  const handleDeletePermission = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa quyền này?")) return;
    try {
      await sysPermissionService.delete(id);
      toast.success("Xóa quyền thành công");
      fetchPermissions();
    } catch {
      toast.error("Xóa quyền thất bại");
    }
  };

  const handleDeletePermissionBatch = async (ids: string[]) => {
    try {
      await sysPermissionService.deleteBatch(ids);
      toast.success(`Đã xóa ${ids.length} quyền`);
      fetchPermissions();
    } catch {
      toast.error("Xóa quyền thất bại");
    }
  };

  const handlePermissionSearchChange = (
    name: string,
    value: any,
  ) => {
    setPermissionSearchParams((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePermissionResetFilters = () => {
    setPermissionSearchParams({ page: 1, size: 10 });
  };

  const handlePermissionPageChange = (page: number) => {
    setPermissionSearchParams((prev) => ({ ...prev, page }));
  };

  const toggleCreatingPermission = () => {
    setIsCreatingPermission((prev) => {
      if (prev) setEditingPermission(null);
      return !prev;
    });
  };

  const toggleEditingPermission = () => {
    setIsEditingPermission((prev) => {
      if (prev) setEditingPermission(null);
      return !prev;
    });
  };

  const startEditingPermission = (perm: SysPermission) => {
    setEditingPermission(perm);
    setIsEditingPermission(true);
  };

  const handlePermissionFormSuccess = () => {
    setIsCreatingPermission(false);
    setIsEditingPermission(false);
    setEditingPermission(null);
    fetchPermissions();
  };

  // ────────────────────── ASSIGN PERMISSIONS DIALOG ───────────────────────
  const openAssignDialog = async (role: SysRole) => {
    setAssigningRole(role);
    setIsLoadingAssign(true);
    try {
      const [allRes, rolePermsRes] = await Promise.all([
        sysPermissionService.search({ page: 1, size: 1000 }),
        sysRoleService.getPermissionsByRole(role.id),
      ]);
      setAllPermissions(allRes.data?.content ?? []);
      setRolePermissions(rolePermsRes.data ?? []);
    } catch {
      toast.error("Không thể tải dữ liệu phân quyền");
    } finally {
      setIsLoadingAssign(false);
    }
  };

  const closeAssignDialog = () => {
    setAssigningRole(null);
    setRolePermissions([]);
    setAllPermissions([]);
  };

  const handleSaveAssign = async (permissionIds: string[]) => {
    if (!assigningRole) return;
    try {
      await sysRoleService.assignPermissions({
        roleId: assigningRole.id,
        permissionIds,
      });
      toast.success("Cập nhật phân quyền thành công");
      closeAssignDialog();
    } catch {
      toast.error("Cập nhật phân quyền thất bại");
    }
  };

  return {
    // Role state
    roleState: {
      roles,
      isLoadingRoles,
      roleSearchParams,
      roleTotalElements,
      roleTotalPages,
      isCreatingRole,
      isEditingRole,
      editingRole,
    },
    // Role actions
    roleActions: {
      handleDeleteRole,
      handleRoleSearchChange,
      handleRoleResetFilters,
      handleRolePageChange,
      toggleCreatingRole,
      toggleEditingRole,
      startEditingRole,
      handleRoleFormSuccess,
      setIsCreatingRole,
    },
    // Permission state
    permissionState: {
      permissions,
      isLoadingPermissions,
      permissionSearchParams,
      permissionTotalElements,
      permissionTotalPages,
      isCreatingPermission,
      isEditingPermission,
      editingPermission,
    },
    // Permission actions
    permissionActions: {
      handleDeletePermission,
      handleDeletePermissionBatch,
      handlePermissionSearchChange,
      handlePermissionResetFilters,
      handlePermissionPageChange,
      toggleCreatingPermission,
      toggleEditingPermission,
      startEditingPermission,
      handlePermissionFormSuccess,
      setIsCreatingPermission,
    },
    // Assign dialog
    assignState: {
      assigningRole,
      rolePermissions,
      allPermissions,
      isLoadingAssign,
    },
    assignActions: {
      openAssignDialog,
      closeAssignDialog,
      handleSaveAssign,
    },
  };
}
