import { ArrowLeft } from "lucide-react";
import guardiansImg from "@/assets/images/phim-kinh-di.png";
import { FaStar } from "react-icons/fa";


const images = {
   guardians: guardiansImg,
   castMember1:
      "http://localhost:5173/assets/64cdce9f41da455f09a29c53114d7fb059045ccf.png",
   castMember2:
      "http://localhost:5173/assets/f67e7feee08e208d29d018ec698d78e3e3851be0.png",
   castMember3:
      "http://localhost:5173/assets/d0c836e2fc41fd70c3e848fdb33cc32a37fc5cff.png",
   castMember4:
      "http://localhost:5173/assets/6be78610716c74930fb36f18c7a0a8ffe65cf33e.png",
   castMember5:
      "http://localhost:5173/assets/fffa5c5e6bcea9bc066e9c65e9063acb84feaa7f.png",
   castMember6:
      "http://localhost:5173/assets/b9a68d5c3751236e86986b370e849d48802ad8e5.png",
   castMember7:
      "http://localhost:5173/assets/752a50ae4607f05ef9bc3a847390e78e259bddda.png",
   recommendedMovie1:
      "http://localhost:5173/assets/1b26250be4903592d678845efae190b5f9bb5ea4.png",
   recommendedMovie2:
      "http://localhost:5173/assets/5ca0b4e10eebfea14a0be9b192287185a5c2a8d3.png",
   recommendedMovie3:
      "http://localhost:5173/assets/09e5759e3191e1953a2ac189c49ecaf6aab6bbe8.png",
};

const recommendedMovies = [
   {
      title: "Alita Battle Angel 4k 2019",
      year: 2018,
      genres: "Action, Adventure",
      duration: "2h 8m",
      image: images.recommendedMovie1,
      rating: 4.5,
   },
   {
      title: "Alita Battle Angel 4k 2019",
      year: 2018,
      genres: "Action, Adventure",
      duration: "2h 8m",
      image: images.recommendedMovie2,
      rating: 4.5,
   },
   {
      title: "Alita Battle Angel 4k 2019",
      year: 2018,
      genres: "Action, Adventure",
      duration: "2h 8m",
      image: images.recommendedMovie3,
      rating: 4.5,
   },
];

export const RecommendedMovies = () => {
   return (
      <section className="max-w-7xl mx-auto px-8">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#d1d5dc]">
               Có thể bạn cũng thích
            </h2>
            <a
               href=""
               className="text-sm text-[#99a1af] flex items-center gap-2"
            >
               Xem tất cả
               <ArrowLeft size={16} className="rotate-180" />
            </a>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
            {recommendedMovies.map((movie, idx) => (
               <div
                  key={idx}
                  className="bg-[#12161c] rounded-xl overflow-hidden"
               >
                  <img
                     src={guardiansImg}
                     alt={movie.title}
                     className="w-max h-max object-cover"
                  />
                  <div className="p-4">
                     <h3 className="font-bold text-white text-sm mb-2">
                        {movie.title}
                     </h3>
                     <p className="text-xs text-[#797b7d] mb-4">
                        {movie.year} - {movie.genres} - {movie.duration}
                     </p>
                     <div className="flex items-center justify-between">
                        <button className="bg-[#f84565] px-4 py-2 rounded-full text-white text-xs font-semibold">
                           Mua vé
                        </button>
                        <div className="flex items-center gap-1">
                           <FaStar size={16} className="text-[#f84565]" />
                           <span className="text-xs text-[#797b7d]">
                              {movie.rating}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         <div className="text-center mt-8">
            <button className="bg-[#f84565] px-6 py-2 rounded-lg text-white text-sm font-semibold">
               Xem thêm
            </button>
         </div>
      </section>
   );
};
