import React, { useMemo } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import profileImg from "@/assets/images/profile-icon.png";
import useAuth from "@/features/auth/hooks/useAuth";
import { useAuthz, ROLES } from "@/hooks/useAuthz";
import { Film } from "lucide-react";

interface SidebarItem {
   label: string;
   path: string;
   roles?: string[];
}

const sidebarItems: SidebarItem[] = [
   { label: "Dashboard", path: "/dashboard" },
   { label: "Quản lý phim", path: "/dashboard/movie-manage" },
   { label: "Quản lý suất chiếu", path: "/dashboard/showtime-manage" },
   { label: "Quản lý đặt chỗ", path: "/dashboard/booking-manage" },
   {
      label: "Quản lý bản mẫu ghế",
      path: "/dashboard/seat-template-manage",
   },
   {
      label: "Quản lý khách hàng",
      path: "/dashboard/customer-manage",
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF],
   },
   {
      label: "Quản lý nhân sự",
      path: "/dashboard/staff-manage",
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF],
   },
   { label: "Quản lý chi nhánh", path: "/dashboard/branch-manage" },
   { label: "Quản lý phòng chiếu", path: "/dashboard/room-manage" },
   {
      label: "Vai trò & Phân quyền",
      path: "/dashboard/rbac-manage",
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
   },
];

const DashboardLayout: React.FC = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { userInfo } = useAuth();
   const { hasAnyRole, canAccessDashboard } = useAuthz();

   const visibleItems = useMemo(
      () =>
         sidebarItems.filter(
            (item) => !item.roles || hasAnyRole(item.roles),
         ),
      [hasAnyRole],
   );

   const isActive = (path: string) => {
      if (path === "/dashboard") {
         return location.pathname === "/dashboard";
      }
      return location.pathname.startsWith(path);
   };

   if (!canAccessDashboard) {
      return (
         <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
            <div className="text-center">
               <p className="text-lg mb-4">
                  Bạn không có quyền truy cập khu vực quản trị.
               </p>
               <Link to="/" className="text-rose-500 hover:underline">
                  Quay về trang chủ
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="relative min-h-screen bg-[#09090b] overflow-hidden">
         <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#09090b] border-b border-[#393939] z-50 flex items-center px-8">
            <Link
               to="/"
               className="logo flex cursor-pointer items-center gap-1.5 text-[20px] font-semibold tracking-[-0.5px] sm:gap-2 sm:text-[28px]"
            >
               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-500/20">
                  <Film className="text-white" size={24} />
               </div>
               <span className="text-white">CineBook</span>
            </Link>
         </header>

         <aside className="fixed left-0 top-[72px] w-[245px] h-[calc(100vh-72px)] bg-[#09090b] border-r border-[#393939] z-40">
            <div className="flex flex-col items-center py-8 border-b border-[#393939]">
               <img
                  src={userInfo?.avatar || profileImg}
                  alt={userInfo?.name || "Profile"}
                  className="w-14 h-14 rounded-full mb-4 object-cover"
               />
               <p className="text-white font-medium text-base">
                  {userInfo?.name || "Guest"}
               </p>
               <p className="text-[#797b7d] text-sm">
                  {userInfo?.email || "No email"}
               </p>
               {userInfo?.roles?.[0] && (
                  <span className="mt-2 text-[10px] uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                     {userInfo.roles[0].name}
                  </span>
               )}
            </div>

            <nav className="py-6">
               <ul className="space-y-0">
                  {visibleItems.map((item) => (
                     <li
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`px-6 py-3 font-medium text-sm transition-colors cursor-pointer ${
                           isActive(item.path)
                              ? "bg-[rgba(248,69,101,0.15)] text-[#f84565] border-l-[6px] border-[#f84565] -ml-6 pl-[calc(24px-6px)]"
                              : "text-white hover:bg-[rgba(248,69,101,0.08)]"
                        }`}
                     >
                        {item.label}
                     </li>
                  ))}
               </ul>
            </nav>
         </aside>

         <main className="ml-[245px] pt-[72px] px-8 pb-20">
            <Outlet />
         </main>
      </div>
   );
};

export default DashboardLayout;
