import { useMemo, useCallback } from "react";
import useAuth from "@/features/auth/hooks/useAuth";

export const ROLES = {
   SUPER_ADMIN: "SUPER_ADMIN",
   ADMIN: "ADMIN",
   STAFF: "STAFF",
   MANAGER: "MANAGER",
   CUSTOMER: "CUSTOMER",
} as const;

export function useAuthz() {
   const { userInfo, permissions } = useAuth();

   const roleCodes = useMemo(
      () =>
         userInfo?.roles?.map((r) => r.code.toUpperCase()) ?? [],
      [userInfo],
   );

   const hasRole = useCallback(
      (role: string) => roleCodes.includes(role.toUpperCase()),
      [roleCodes],
   );

   const hasAnyRole = useCallback(
      (roles: string[]) =>
         roles.some((role) => roleCodes.includes(role.toUpperCase())),
      [roleCodes],
   );

   const hasPermission = useCallback(
      (permission: string) => permissions.includes(permission),
      [permissions],
   );

   const customerPermissions = useMemo(
      () => ({
         canView: hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF]),
         canCreate: hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
         canUpdate: hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
         canDelete: hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
      }),
      [hasAnyRole],
   );

   const staffPermissions = useMemo(
      () => ({
         canView: hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF]),
         canCreate: hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
         canUpdate: hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
         canTransfer: hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
      }),
      [hasAnyRole],
   );

   const canAccessDashboard = useMemo(
      () =>
         hasAnyRole([
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.STAFF,
            ROLES.MANAGER,
         ]),
      [hasAnyRole],
   );

   return {
      roleCodes,
      hasRole,
      hasAnyRole,
      hasPermission,
      customerPermissions,
      staffPermissions,
      canAccessDashboard,
   };
}
