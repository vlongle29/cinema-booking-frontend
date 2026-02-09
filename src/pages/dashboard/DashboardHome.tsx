import { Star } from "lucide-react";

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

const movies = [
   { id: 1, title: "Alita Battle Angel 4k 2019", rating: 4.5, price: "$29" },
   { id: 2, title: "Alita Battle Angel 4k 2019", rating: 4.5, price: "$29" },
   { id: 3, title: "Alita Battle Angel 4k 2019", rating: 4.5, price: "$29" },
];

export default function DashboardHome() {
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
         <section className="grid grid-cols-4 gap-4 mb-16">
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
               Active Movies
            </h2>

            {/* Movie Cards Grid */}
            <div className="grid grid-cols-3 gap-5">
               {movies.map((movie) => (
                  <div
                     key={movie.id}
                     className="bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-[8px] overflow-hidden transition-all hover:border-[#f84565]"
                  >
                     {/* Movie Poster */}
                     <div className="relative w-full h-44 overflow-hidden rounded-t-[8px]">
                        <img
                           src={imgWp49260591}
                           alt={movie.title}
                           className="w-full h-full object-cover"
                        />
                     </div>

                     {/* Movie Info */}
                     <div className="p-4">
                        <h3 className="text-white font-medium text-xs mb-3 line-clamp-2 leading-4">
                           {movie.title}
                        </h3>

                        {/* Rating and Price */}
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-1">
                              <Star
                                 size={16}
                                 className="text-[#f84565] fill-[#f84565] flex-shrink-0"
                              />
                              <span className="text-[#797b7d] text-xs font-medium">
                                 {movie.rating}
                              </span>
                           </div>
                           <span className="text-white font-semibold text-base">
                              {movie.price}
                           </span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </section>
      </>
   );
}
