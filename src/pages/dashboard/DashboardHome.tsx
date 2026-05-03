import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { movieService } from "../../services/movieService";
import { showtimeService } from "@/services/showtimeService";
import { API_BASE_URL } from "../../constants/api";

const imgWp49260591 =
   "http://localhost:3845/assets/1b26250be4903592d678845efae190b5f9bb5ea4.png";
const imgGraphUp1 =
   "http://localhost:3845/assets/343a99c23e50e6650a6c76dd675fcc5cb928576b.svg";
const imgSvgRepoIconCarrier =
   "http://localhost:3845/assets/52141b07f2313a04891fc2aa251e28ed8c406617.svg";
const imgSvgRepoIconCarrier1 =
   "http://localhost:3845/assets/0716154444af29c3b7531087752e8993f9323b8b.svg";
const imgUserUsers =
   "http://localhost:3845/assets/16424f3b694c07e8e484a99b4476096d9d107ace.svg";

const statCards = [
   { label: "Total Bookings", value: "73", icon: imgGraphUp1 },
   { label: "Total Revenue", value: "$1,060", icon: imgSvgRepoIconCarrier },
   { label: "Active Movies", value: "3", icon: imgSvgRepoIconCarrier1 },
   { label: "Total Users", value: "43", icon: imgUserUsers },
];

type Movie = {
   id: string;
   title: string;
   rated: string;
   durationMinutes: number;
   posterUrl: string;
   status: string;
};

type Showtime = {
   id: string;
   movieId: string;
   startTime: string;
   endTime: string;
   theater: string;
   movie: Movie;
   price: number;
};

export default function DashboardHome() {
   const [showtimes, setShowtimes] = useState<Showtime[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await showtimeService.searchShowtimes();
            setShowtimes(response.data.content);
         } catch (error) {
            console.error("Error fetching dashboard stats:", error);
         }
      };

      fetchData();
   }, []);

   return (
      <>
         {/* Page Title */}
         <div className="mb-12 mt-6">
            <h1 className="text-4xl font-semibold text-white">
               Admin{" "}
               <span className="underline decoration-[#f84565] text-[#f84565]">
                  Dashboard
               </span>
            </h1>
         </div>

         {/* Stats Cards Grid */}
         <section className="grid grid-cols-5 gap-4 mb-16">
            {statCards.map((stat, idx) => (
               <div
                  key={idx}
                  className="bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-[6px] p-4 flex flex-col justify-between h-[77px]"
               >
                  <p className="text-[#d1d5dc] text-xs font-normal leading-5">
                     {stat.label}
                  </p>
                  <div className="flex items-center justify-between">
                     <p className="text-white text-xl font-normal tracking-tighter">
                        {stat.value}
                     </p>
                     <img src={stat.icon} alt="" className="w-3 h-2" />
                  </div>
               </div>
            ))}
         </section>

         {/* Active Movies Section */}
         <section>
            <h2 className="text-white text-base font-semibold mb-6">
               Suất chiếu đang hoạt động
            </h2>

            {/* Movie Cards Grid */}
            <div className="grid grid-cols-5 gap-5">
               {showtimes.map((showtime) => {
                  // Format tiền VND
                  const formattedPrice = new Intl.NumberFormat("vi-VN", {
                     style: "currency",
                     currency: "VND",
                  }).format(showtime.price);

                  // Format thời gian sang Tiếng Việt (VD: "Th 7, 9 tháng 5 lúc 09:00")
                  const date = new Date(showtime.startTime);
                  const weekdays = [
                     "CN",
                     "Th 2",
                     "Th 3",
                     "Th 4",
                     "Th 5",
                     "Th 6",
                     "Th 7",
                  ];
                  const dayOfWeek = weekdays[date.getDay()];
                  const day = date.getDate();
                  const month = date.getMonth() + 1;
                  const hours = date.getHours().toString().padStart(2, "0");
                  const minutes = date.getMinutes().toString().padStart(2, "0");
                  const formattedTime = `${dayOfWeek}, ${day} tháng ${month} lúc ${hours}:${minutes}`;

                  return (
                     <div
                        key={showtime.id}
                        // Màu nền tối (hơi pha đỏ/nâu) giống thiết kế
                        className="bg-[#2a1c21] border border-[#3f252c] rounded-[8px] overflow-hidden transition-all hover:border-[#f84565] flex flex-col"
                     >
                        {/* Movie Poster */}
                        {/* Tăng chiều cao (h-64 hoặc h-72) để tỷ lệ ảnh dọc giống hình */}
                        <div className="relative w-full h-64 overflow-hidden rounded-t-[8px]">
                           <img
                              src={`${API_BASE_URL}${showtime.movie.posterUrl}`}
                              alt={showtime.movie.title}
                              className="w-full h-full object-cover"
                           />
                        </div>

                        {/* Movie Info */}
                        <div className="p-4 flex flex-col">
                           {/* Title */}
                           <h3 className="text-sm text-white font-bold text-base mb-3 line-clamp-1">
                              {showtime.movie.title}
                           </h3>

                           {/* Price and Rating */}
                           <div className="flex items-center justify-between mb-3">
                              {/* Price */}
                              <span className="text-white font-bold text-base">
                                 {formattedPrice}
                              </span>

                              {/* Rating (Dùng trường 'rated' của JSON, ví dụ T16) */}
                              <div className="flex items-center gap-1.5">
                                 <Star
                                    size={16}
                                    className="text-[#f84565] fill-[#f84565] flex-shrink-0"
                                 />
                                 <span className="text-[#9ca3af] text-sm font-medium">
                                    {showtime.movie.rated || "N/A"}
                                 </span>
                              </div>
                           </div>

                           {/* Date & Time */}
                           <div className="text-[#6b7280] text-sm font-medium">
                              {formattedTime}
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </section>
      </>
   );
}
