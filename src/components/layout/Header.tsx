import { Link, NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import MoviesDropdown from "./MoviesDropdown";
import "../../styles/header.css";

const navItems = [
   { to: "/", label: "Home", end: true },
   { to: "/theatres", label: "Theatres", end: false },
   { to: "/releases", label: "Releases", end: false },
];

const Header = () => {
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
                  <button className="login-btn">Log In</button>
               </div>
            </div>
         </nav>
      </div>
   );
};

export default Header;
