import { useState, useRef } from "react";
import { Link } from "react-router-dom";

interface MenuItemType {
   id: string;
   label: string;
   href: string;
}

const menuItems: MenuItemType[] = [
   { id: "now-showing", label: "Phim đang chiếu", href: "/movies/now-showing" },
   { id: "coming-soon", label: "Phim sắp chiếu", href: "/movies/coming-soon" },
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
         className="relative inline-flex items-center group"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         <button className="relative text-sm font-mediu0 bg-transparent border-0 p-0 cursor-pointer transition-all duration-200 opacity-85 hover:opacity-100 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all after:duration-200 hover:after:w-full">
            Movies
         </button>

         {isOpen && (
            <div className="absolute top-[calc(100%_+_12px)] left-[-20px] bg-[rgba(30,41,59,0.98)] border border-[rgba(148,163,184,0.12)] rounded-xl shadow-2xl overflow-hidden z-[2100] backdrop-blur-lg min-w-[220px] animate-slideDownAndFadeIn">
               <nav className="flex flex-col p-2 m-0 list-none">
                  {menuItems.map((item) => (
                     <Link
                        key={item.id}
                        to={item.href}
                        className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 no-underline cursor-pointer relative ${
                           activeItemId === item.id
                              ? "text-slate-100"
                              : "text-gray-400 hover:text-slate-100"
                        } focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-0`}
                        onMouseEnter={() => handleItemHover(item.id)}
                        onMouseLeave={handleItemLeave}
                        onClick={handleItemClick}
                     >
                        <span className="flex-1 tracking-wide">
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
