import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import LoginModal from "./LoginModal";
import useAuth from "../../hooks/useAuth";
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
         <nav className="fixed top-0 z-[1000] h-[64px] w-full border-b border-white/15 bg-transparent px-3 md:h-[72px] md:px-10 md:backdrop-blur-[5px] max-[480px]:px-3">
            <div className="mx-auto flex h-full max-w-[1440px] flex-wrap items-center justify-between">
               <Link
                  to="/"
                  className="flex cursor-pointer items-center gap-1.5 text-[20px] font-semibold tracking-[-0.5px] sm:gap-2 sm:text-[28px]"
               >
                  <span>CineBook</span>
               </Link>

               {/* ĐÃ FIX: Dùng flex mặc định và chỉ hidden khi màn hình < 480px */}
               <div className="flex items-center max-[480px]:hidden">
                  <div className="flex items-center gap-5 rounded-[68px] border border-white/15 bg-white/10 px-5 py-2.5 backdrop-blur-[2.5px] md:gap-8 md:px-6 md:py-3">
                     {navItems.map(({ to, label, end, children }) => {
                        const linkElement = (
                           <NavLink to={to} end={end}>
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
                                    className="z-[2000] flex w-48 flex-col gap-1 border-[rgba(148,163,184,0.12)] bg-[rgba(30,41,59,0.95)] p-2 shadow-2xl backdrop-blur-lg"
                                 >
                                    {children.map((item) => (
                                       <NavLink
                                          key={item.to}
                                          to={item.to}
                                          className="rounded-md px-4 py-2 text-sm text-gray-300 no-underline transition-colors hover:bg-white/10 hover:text-white"
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
                        ["ADMIN", "SUPER_ADMIN", "EMPLOYEE"].includes(
                           role.code,
                        ),
                     ) && <NavLink to="/dashboard">Dashboard</NavLink>}
                  </div>
               </div>

               <div className="flex items-center gap-3 sm:gap-5">
                  <button className="flex cursor-pointer items-center justify-center border-none bg-transparent p-2 text-white transition-all duration-300 hover:scale-110 hover:text-[#f84565]">
                     <Search size={20} />
                  </button>
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
                           className="mt-4 w-56 border-[rgba(148,163,184,0.12)] bg-[rgba(30,41,59,0.95)] text-white shadow-2xl backdrop-blur-lg"
                        >
                           <DropdownMenuLabel className="font-normal">
                              <div className="flex flex-col space-y-2">
                                 <p className="text-sm font-semibold leading-none text-white">
                                    {userInfo.name}
                                 </p>
                                 <p className="text-xs leading-none text-gray-400">
                                    {userInfo.email}
                                 </p>
                              </div>
                           </DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              asChild
                              className="cursor-pointer py-2 focus:bg-white/10 focus:text-white"
                           >
                              <Link to="/my-bookings">Lịch sử đặt vé</Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              asChild
                              className="cursor-pointer focus:bg-white/10 focus:text-white"
                           >
                              <Link to="/profile">Quản lý tài khoản</Link>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              onClick={() => logout()}
                              className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                           >
                              Đăng xuất
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ) : (
                     <button
                        className="flex h-[45px] w-[116px] items-center justify-center rounded-[32px] bg-[#f84565] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#ff5580] hover:shadow-[0_8px_16px_rgba(248,69,101,0.3)]"
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
