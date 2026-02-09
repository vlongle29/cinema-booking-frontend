import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import AddMovies from "./AddMovies";
import ListShows from "./ListShows";
import ListBookings from "./ListBookings";

const imgProfileImg =
   "http://localhost:3845/assets/228bdbc0f2f37782d9812b5350a009c2cda36a3e.png";

const sidebarItems = [
   { label: "Dashboard", path: "/dashboard" },
   { label: "Add Movies", path: "/dashboard/add-movies" },
   { label: "List Shows", path: "/dashboard/list-shows" },
   { label: "List Bookings", path: "/dashboard/list-bookings" },
];

export default function Dashboard() {
   const navigate = useNavigate();
   const location = useLocation();

   const isActive = (path: string) => {
      if (path === "/dashboard") {
         return location.pathname === "/dashboard";
      }
      return location.pathname.startsWith(path);
   };

   return (
      <div className="relative min-h-screen bg-[#09090b] overflow-hidden">
         {/* Sidebar */}
         <aside className="fixed left-0 top-[72px] w-[245px] h-[calc(100vh-72px)] bg-[#09090b] border-r border-[#393939] z-40">
            {/* Profile Section */}
            <div className="flex flex-col items-center py-8 border-b border-[#393939]">
               <img
                  src={imgProfileImg}
                  alt="Profile"
                  className="w-14 h-14 rounded-full mb-4 object-cover"
               />
               <p className="text-white font-medium text-base">
                  Richard Sanford
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

         {/* Main Content */}
         <main className="ml-[265px] pt-[72px] px-8 pb-20">
            {/* Render nested routes - pages will change without reloading sidebar */}
            <Routes>
               <Route index element={<DashboardHome />} />
               <Route path="add-movies" element={<AddMovies />} />
               <Route path="list-shows" element={<ListShows />} />
               <Route path="list-bookings" element={<ListBookings />} />
            </Routes>
         </main>
      </div>
   );
}
