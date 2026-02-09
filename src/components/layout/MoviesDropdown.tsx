import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../../styles/MoviesDropdown.css";

interface MenuItemType {
   id: string;
   label: string;
   href: string;
}

const menuItems: MenuItemType[] = [
   { id: "now-showing", label: "Phim đang chiếu", href: "/movies/now-showing" },
   { id: "coming-soon", label: "Sắp chiếu", href: "/movies/coming-soon" },
];

const MoviesDropdown = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [activeItemId, setActiveItemId] = useState<string | null>(null);
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
   const containerRef = useRef<HTMLDivElement>(null);

   const handleMouseEnter = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
   };

   const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
         setIsOpen(false);
         setActiveItemId(null);
      }, 100);
   };

   const handleItemHover = (itemId: string) => {
      setActiveItemId(itemId);
   };

   const handleItemLeave = () => {
      setActiveItemId(null);
   };

   const handleItemClick = () => {
      setIsOpen(false);
      setActiveItemId(null);
   };

   return (
      <div
         ref={containerRef}
         className="movies-dropdown-container"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         <button className="movies-dropdown-trigger">Movies</button>

         {isOpen && (
            <div className="movies-dropdown-popup">
               <nav className="movies-dropdown-menu">
                  {menuItems.map((item) => (
                     <Link
                        key={item.id}
                        to={item.href}
                        className={`movies-dropdown-item ${
                           activeItemId === item.id ? "active" : ""
                        }`}
                        onMouseEnter={() => handleItemHover(item.id)}
                        onMouseLeave={handleItemLeave}
                        onClick={handleItemClick}
                     >
                        <span className="movies-dropdown-item-text">
                           {item.label}
                        </span>
                     </Link>
                  ))}
               </nav>
            </div>
         )}
      </div>
   );
};

export default MoviesDropdown;
