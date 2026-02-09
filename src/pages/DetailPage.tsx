import { useState } from "react";
import { Link } from "react-router-dom";
import {
   Star,
   Calendar,
   Clock,
   Play,
   ArrowLeft,
   ArrowRight,
} from "lucide-react";
import marvellogo from "../assets/icons/marvelLogo.svg";

const videoData = [
   { id: "WpW36ldAqnM", title: "Ironheart Official Trailer" },
   { id: "-sAOWhvheK8", title: "Thunderbolts* Final Trailer" },
   { id: "1pHDWnXmK7Y", title: "Captain America: BNW" },
   { id: "umiKiW4En9g", title: "What If...? Season 3" },
];

const movieDetail = {
   id: 1,
   title: "Guardians of the Galaxy",
   genre: "Action | Adventure | Sci-Fi",
   year: "2018",
   duration: "2h 8m",
   rating: 4.5,
   image: "/src/assets/images/hero-bg.jpg",
   description:
      "In a post-apocalyptic world where cities ride on wheels and consume each other to survive, two people meet in London and try to stop a conspiracy.",
};

const DetailPage: React.FC = () => {
   const [currentVideo, setCurrentVideo] = useState(videoData[0]);

   return (
      <div className="min-h-screen bg-[#09090b]">
         {/* Hero Section */}
         <section className="relative w-full min-h-screen overflow-hidden flex items-center">
            {/* Background */}
            <div className="absolute inset-0 z-0">
               <img
                  src={movieDetail.image}
                  alt={movieDetail.title}
                  className="w-full h-full object-cover brightness-40"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-[1200px] w-full px-10 py-24">
               <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-[#d1d5dc] hover:text-[#f84565] text-sm font-medium transition-colors mb-8"
               >
                  <ArrowLeft size={20} />
                  Back to Home
               </Link>

               <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
                  {/* Poster */}
                  <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[2/3]">
                     <img
                        src={movieDetail.image}
                        alt={movieDetail.title}
                        className="w-full h-full object-cover"
                     />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-4">
                     <div className="w-32 h-8">
                        <img
                           src={marvellogo}
                           alt="Marvel"
                           className="w-full h-full object-contain"
                        />
                     </div>

                     <h1 className="text-5xl font-semibold text-white leading-tight">
                        {movieDetail.title}
                     </h1>

                     <p className="text-base font-medium text-[#d1d5dc]">
                        {movieDetail.genre}
                     </p>

                     <div className="flex flex-wrap gap-6 items-center">
                        <div className="flex items-center gap-2 text-base font-medium text-[#d1d5dc]">
                           <Calendar size={18} />
                           <span>{movieDetail.year}</span>
                        </div>
                        <div className="flex items-center gap-2 text-base font-medium text-[#d1d5dc]">
                           <Clock size={18} />
                           <span>{movieDetail.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-base font-semibold text-white">
                           <Star size={20} fill="#F84565" stroke="#F84565" />
                           <span>{movieDetail.rating}</span>
                        </div>
                     </div>

                     <p className="text-base font-normal text-[#ebf3ff] leading-6 max-w-2xl mt-2">
                        {movieDetail.description}
                     </p>

                     <div className="flex gap-4 mt-4">
                        <button className="px-6 py-3 bg-[#1e2939] hover:bg-[#2a3a4a] text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
                           <Play size={18} />
                           Watch Trailer
                        </button>
                        <Link
                           to="/seat-select"
                           className="px-6 py-3 bg-[#f84565] hover:bg-[#ff5580] text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        >
                           Buy Tickets
                           <ArrowRight size={18} />
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Trailers Section */}
         <section className="w-full py-16 px-10 bg-[#09090b]">
            <div className="max-w-5xl mx-auto">
               <h2 className="text-2xl font-bold text-[#d1d5dc] mb-8">
                  Trailers
               </h2>

               {/* Main Video */}
               <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden mb-8">
                  <iframe
                     className="absolute top-0 left-0 w-full h-full"
                     src={`https://www.youtube.com/embed/${currentVideo.id}`}
                     title={currentVideo.title}
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                  ></iframe>
               </div>

               {/* Thumbnail List */}
               <div className="grid grid-cols-4 gap-4">
                  {videoData.map((video) => (
                     <div
                        key={video.id}
                        onClick={() => setCurrentVideo(video)}
                        className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                           video.id === currentVideo.id
                              ? "border-[#f84565] scale-105"
                              : "border-[rgba(248,69,101,0.39)] hover:border-[#f84565]"
                        }`}
                     >
                        <img
                           src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                           alt={video.title}
                           className="w-full h-32 object-cover opacity-75 group-hover:opacity-100"
                        />
                        {/* Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center">
                              <Play
                                 size={20}
                                 className="text-white fill-white ml-0.5"
                              />
                           </div>
                        </div>
                        {/* Title */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                           <p className="text-white text-xs font-medium truncate">
                              {video.title}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
   );
};

export default DetailPage;
