import React from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import profileImg from "@/assets/images/profile-icon.png";
import useAuth from "@/features/auth/hooks/useAuth";

const sidebarItems = [
   { label: "Dashboard", path: "/dashboard" },
   { label: "Quản lý phim", path: "/dashboard/movie-manage" },
   { label: "Quản lý suất chiếu", path: "/dashboard/showtime-manage" },
   { label: "Quản lý đặt chỗ", path: "/dashboard/booking-manage" },
   { label: "Quản lý bản mẫu ghế", path: "/dashboard/seat-template-manage" },
   { label: "Quản lý người dùng", path: "/dashboard/user-manage" },
   { label: "Quản lý chi nhánh", path: "/dashboard/branch-manage" },
   { label: "Quản lý phòng chiếu", path: "/dashboard/room-manage" },
];

const DashboardLayout: React.FC = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { userInfo } = useAuth();

   const isActive = (path: string) => {
      if (path === "/dashboard") {
         return location.pathname === "/dashboard";
      }
      return location.pathname.startsWith(path);
   };

   return (
      <div className="relative min-h-screen bg-[#09090b] overflow-hidden">
         {/* Top Header */}
         <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#09090b] border-b border-[#393939] z-50 flex items-center px-8">
            <Link to="/" className="logo no-underline">
               <span className="logo-text">CineBook</span>
            </Link>
         </header>

         {/* Sidebar */}
         <aside className="fixed left-0 top-[72px] w-[245px] h-[calc(100vh-72px)] bg-[#09090b] border-r border-[#393939] z-40">
            {/* Profile Section */}
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
            </div>

            {/* Navigation */}
            <nav className="py-6">
               <ul className="space-y-0">
                  {sidebarItems.map((item) => (
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

         {/* Main Content Area */}
         <main className="ml-[245px] pt-[72px] px-8 pb-20">
            <Outlet />
         </main>
      </div>
   );
};

export default DashboardLayout;
