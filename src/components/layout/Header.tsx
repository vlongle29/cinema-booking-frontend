import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import MoviesDropdown from "./MoviesDropdown";
import "../../styles/header.css";
import LoginModal from "../common/LoginModal";
import useAuth from "../../hooks/useAuth";

const navItems = [
   { to: "/", label: "Home", end: true },
   { to: "/theatres", label: "Theatres", end: false },
   { to: "/releases", label: "Releases", end: false },
];

const Header = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const { user, logout } = useAuth();

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
                     <MoviesDropdown />
                  </div>
               </div>

               <div className="nav-actions">
                  <button className="search-btn">
                     <Search size={20} />
                  </button>
                  {user ? (
                     // In a real app, this would open a user menu
                     <button
                        onClick={logout}
                        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                     >
                        <img
                           src={
                              user.avatar ||
                              "https://randomuser.me/api/portraits/men/75.jpg"
                           }
                           alt={user.name || "User"}
                           className="w-full h-full object-cover"
                        />
                     </button>
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
