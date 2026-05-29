import { API_BASE_URL } from "@/constants/api";
import type { Movie } from "@/types/movie";
import BlurredCircle from "@/components/ui/BlurredCircle";
import guardiansImg from "@/assets/images/phim-kinh-di.png";

import { FaStar } from "react-icons/fa";
import { IoPlayCircle } from "react-icons/io5";


interface MovieHeroProps {
   movie: Movie;
   onBuyTicketClick: () => void;
}

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

export const MovieHero = ({ movie, onBuyTicketClick }: MovieHeroProps) => {
   return (
      <section className="mt-36 max-w-7xl px-8 py-12 flex gap-12 inset-0 mx-auto">
         {/* Movie Poster */}
         <div className="flex-shrink-0">
            <img
               src={
                  movie ? `${API_BASE_URL}${movie.posterUrl}` : images.guardians
               }
               alt={movie?.title || "Movie Poster"}
               className="relative z-10 w-[278px] h-[417px] rounded-[18px] object-cover"
            />
         </div>

         {/* Movie Info */}
         <div className="flex-1 relative">
            <BlurredCircle className="z-50 -top-24 -left-24" />
            <span className="text-[#f84565] text-sm font-semibold tracking-wider">
               {movie?.language || "LOADING..."}
            </span>
            <h1 className="text-5xl font-bold mt-3 mb-6">
               {movie?.title || "Movie Title"}
            </h1>

            <div className="flex items-center gap-4 mb-6">
               <FaStar size={24} className="text-[#f84565]" />
               <span className="text-sm text-[#d1d5dc]">
                  Độ tuổi: {movie?.rated || "T16"}
               </span>
            </div>

            <p className="text-[#99a1af] text-sm leading-relaxed mb-4 max-w-2xl">
               {movie?.description || "Loading description..."}
            </p>

            <p className="text-[#d1d5dc] text-sm mb-6">
               {movie?.durationMinutes}m •{" "}
               {movie?.genres?.map((g) => g.name).join(" | ")} •{" "}
               {movie?.releaseDate}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
               <button className="flex items-center gap-2 border border-[rgba(248,69,101,0.3)] px-6 py-3 rounded-lg text-white font-semibold">
                  <IoPlayCircle size={20} />
                  Xem Trailer
               </button>
               <button
                  onClick={onBuyTicketClick}
                  className="bg-[#f84565] px-6 py-3 rounded-lg text-white font-semibold"
               >
                  Mua vé
               </button>
            </div>
         </div>
      </section>
   );
};
