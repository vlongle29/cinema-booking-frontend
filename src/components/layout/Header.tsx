import { Search } from "lucide-react";
import "../../styles/header.css";

const Header = () => {
   return (
      <div>
         <nav className="navbar">
            <div className="navbar-container">
               <div className="logo">
                  <span className="logo-icon">Q</span>
                  <span className="logo-text">uickShow</span>
               </div>

               <div className="nav-links">
                  <a href="#home" className="nav-link active">
                     Home
                  </a>
                  <a href="#movies" className="nav-link">
                     Movies
                  </a>
                  <a href="#theatres" className="nav-link">
                     Theatres
                  </a>
                  <a href="#releases" className="nav-link">
                     Releases
                  </a>
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
