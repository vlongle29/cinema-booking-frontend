import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import MoviesDropdown from "./MoviesDropdown";
import "../../styles/header.css";
import LoginModal from "../common/LoginModal";
import useAuth from "../../hooks/useAuth";
import userIcon from "../../assets/icons/user.png";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const navItems = [
   { to: "/", label: "Home", end: true },
   { to: "/theatres", label: "Theatres", end: false },
   { to: "/releases", label: "Releases", end: false },
];

const Header = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const { userInfo, logout } = useAuth();

   // This function would be called on successful login from the modal
   const handleLoginSuccess = () => {
      setIsModalOpen(false);
   };

   return (
      <div>
         <nav className="navbar">
            <div className="navbar-container">
               <Link to="/" className="logo">
                  <span className="logo-icon">Q</span>
                  <span className="logo-text">uickShow</span>
               </Link>

               <div className="nav-links">
                  <div className="nav-links-pill">
                     {navItems.map(({ to, label, end }) => (
                        <NavLink
                           key={to}
                           to={to}
                           end={end}
                           className={({ isActive }) =>
                              `nav-link ${isActive ? "active" : ""}`
                           }
                        >
                           {label}
                        </NavLink>
                     ))}
                     {userInfo?.roles?.some((role) =>
                        ["ADMIN", "SUPER_ADMIN", "EMPLOYEE"].includes(
                           role.code,
                        ),
                     ) && (
                        <NavLink
                           to="/dashboard"
                           className={({ isActive }) =>
                              `nav-link ${isActive ? "active" : ""}`
                           }
                        >
                           Dashboard
                        </NavLink>
                     )}
                     <MoviesDropdown />
                  </div>
               </div>

               <div className="nav-actions">
                  <button className="search-btn">
                     <Search size={20} />
                  </button>
                  {userInfo ? (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <button className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white cursor-pointer transition-transform hover:scale-105">
                              <img
                                 src={userInfo.avatar || userIcon}
                                 alt={userInfo.name || "User"}
                                 className="w-full h-full object-cover"
                              />
                           </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                           align="end"
                           className="w-56 bg-[rgba(30,41,59,0.95)] backdrop-blur-lg border-[rgba(148,163,184,0.12)] text-white shadow-2xl"
                        >
                           <DropdownMenuLabel className="font-normal">
                              <div className="flex flex-col space-y-1">
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
                              className="cursor-pointer focus:bg-white/10 focus:text-white"
                           >
                              <Link to="/bookings">My Bookings</Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              asChild
                              className="cursor-pointer focus:bg-white/10 focus:text-white"
                           >
                              <Link to="/profile">Manage account</Link>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              onClick={() => logout()}
                              className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                           >
                              Log out
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ) : (
                     <button
                        className="login-btn"
                        onClick={() => setIsModalOpen(true)}
                     >
                        Log In
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
