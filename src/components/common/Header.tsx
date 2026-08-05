import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Film, Search } from "lucide-react";
import { LoginModal } from "@/features/auth/components";
import useAuth from "../../features/auth/hooks/useAuth";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import profileIcon from "@/assets/images/profile-icon.png";
import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "@/components/ui/hover-card";

const navItems = [
   { to: "/", label: "Trang chủ", end: true },
   {
      to: "/movies",
      label: "Phim",
      end: false,
      children: [
         { to: "/movies/status/SHOWING", label: "Phim đang chiếu" },
         { to: "/movies/status/COMING_SOON", label: "Phim sắp chiếu" },
      ],
   },
];

const Header = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const { userInfo, logout } = useAuth();

   const handleLoginSuccess = () => {
      setIsModalOpen(false);
   };

   return (
      <div>
         <nav className="fixed top-0 z-[1000] h-[64px] w-full border-b border-slate-200/50 bg-white/60 px-3 md:h-[72px] md:px-10 md:backdrop-blur-md max-[480px]:px-3 transition-all duration-300 shadow-sm">
            <div className="mx-auto flex h-full max-w-[1440px] flex-wrap items-center justify-between">
               <Link
                  to="/"
                  className="flex cursor-pointer items-center gap-1.5 text-[20px] font-bold text-slate-900 tracking-[-0.5px] sm:gap-2 sm:text-[28px]"
               >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                     <Film className="text-white" size={24} />
                  </div>
                  <span>CineBook</span>
               </Link>

               {/* ĐÃ FIX: Dùng flex mặc định và chỉ hidden khi màn hình < 480px */}
               <div className="flex items-center max-[480px]:hidden">
                  <div className="flex items-center gap-5 rounded-[68px] border border-slate-200 bg-white/80 text-slate-700 font-medium px-5 py-2.5 shadow-sm backdrop-blur-md md:gap-8 md:px-6 md:py-3">
                     {navItems.map(({ to, label, end, children }) => {
                        const linkElement = (
                           <NavLink key={to} to={to} end={end}>
                              {label}
                           </NavLink>
                        );

                        if (children) {
                           return (
                              <HoverCard
                                 key={to}
                                 openDelay={100}
                                 closeDelay={200}
                              >
                                 <HoverCardTrigger
                                    asChild
                                    className="cursor-pointer"
                                 >
                                    {linkElement}
                                 </HoverCardTrigger>
                                 <HoverCardContent
                                    sideOffset={12}
                                    className="z-[2000] flex w-48 flex-col gap-1 border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-lg rounded-xl"
                                 >
                                    {children.map((item) => (
                                       <NavLink
                                          key={item.to}
                                          to={item.to}
                                          className="rounded-md px-4 py-2 text-sm text-slate-600 no-underline transition-colors hover:bg-slate-100 hover:text-amber-600 font-medium"
                                       >
                                          {item.label}
                                       </NavLink>
                                    ))}
                                 </HoverCardContent>
                              </HoverCard>
                           );
                        }

                        return linkElement;
                     })}

                     {userInfo?.roles?.some((role) =>
                        ["ADMIN", "SUPER_ADMIN", "STAFF", "MANAGER"].includes(
                           role.code,
                        ),
                     ) && <NavLink to="/dashboard">Dashboard</NavLink>}
                  </div>
               </div>

               <div className="flex items-center gap-3 sm:gap-5">
                 
                  {userInfo ? (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <img
                              src={userInfo.avatar || profileIcon}
                              alt={userInfo.name || "User"}
                              className="h-10 w-10 cursor-pointer overflow-hidden rounded-full object-cover"
                              onError={(e) => {
                                 (e.target as HTMLImageElement).src =
                                    profileIcon;
                              }}
                           />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                           align="end"
                           className="mt-4 w-56 border-slate-200 bg-white text-slate-900 shadow-xl rounded-xl backdrop-blur-lg"
                        >
                           <DropdownMenuLabel className="font-normal">
                              <div className="flex flex-col space-y-2">
                                 <p className="text-sm font-semibold leading-none text-slate-900">
                                    {userInfo.name}
                                 </p>
                                 <p className="text-xs leading-none text-slate-500">
                                    {userInfo.email}
                                 </p>
                              </div>
                           </DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              asChild
                              className="cursor-pointer py-2 focus:bg-slate-100 focus:text-amber-600 font-medium"
                           >
                              <Link to="/my-bookings">Lịch sử đặt vé</Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              asChild
                              className="cursor-pointer focus:bg-slate-100 focus:text-amber-600 font-medium"
                           >
                              <Link to="/profile">Quản lý tài khoản</Link>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              onClick={() => logout()}
                              className="cursor-pointer font-medium text-red-500 focus:bg-red-50 focus:text-red-600"
                           >
                              Đăng xuất
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ) : (
                     <button
                        className="flex h-[45px] w-[116px] items-center justify-center rounded-[32px] bg-amber-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[2px] hover:bg-amber-600 hover:shadow-[0_8px_16px_rgba(245,158,11,0.3)] shadow-sm"
                        onClick={() => setIsModalOpen(true)}
                     >
                        Đăng nhập
                     </button>
                  )}
               </div>
            </div>
         </nav>

         <LoginModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
         />
      </div>
   );
};

export default Header;
