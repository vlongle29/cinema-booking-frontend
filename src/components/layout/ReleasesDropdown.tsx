import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../../styles/ReleasesDropdown.css";

interface MenuItemType {
   id: string;
   label: string;
   href: string;
}

const menuItems: MenuItemType[] = [
   {
      id: "now-showing",
      label: "Phim đang chiếu",
      href: "/releases/now-showing",
   },
   { id: "coming-soon", label: "Sắp chiếu", href: "/releases/coming-soon" },
];

const ReleasesDropdown = () => {
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
         className="releases-dropdown-container"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         <button className="releases-dropdown-trigger">Releases</button>

         {isOpen && (
            <div className="releases-dropdown-popup">
               <nav className="releases-dropdown-menu">
                  {menuItems.map((item) => (
                     <Link
                        key={item.id}
                        to={item.href}
                        className={`releases-dropdown-item ${
                           activeItemId === item.id ? "active" : ""
                        }`}
                        onMouseEnter={() => handleItemHover(item.id)}
                        onMouseLeave={handleItemLeave}
                        onClick={handleItemClick}
                     >
                        <span className="releases-dropdown-item-text">
                           {item.label}
                        </span>
                        <span className="releases-dropdown-item-indicator"></span>
                     </Link>
                  ))}
               </nav>
            </div>
         )}
      </div>
   );
};

export default ReleasesDropdown;
