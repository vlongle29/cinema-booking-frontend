import React, { useState } from "react";
import { Play, Film } from "lucide-react";

const videoData = [
   { id: "WpW36ldAqnM", title: "Ironheart Official Trailer" },
   { id: "-sAOWhvheK8", title: "Thunderbolts* Final Trailer" },
   { id: "1pHDWnXmK7Y", title: "Captain America: BNW" },
   { id: "umiKiW4En9g", title: "What If...? Season 3" },
];

export const TrailerGallery: React.FC = () => {
   const [currentVideo, setCurrentVideo] = useState(videoData[0]);
   const [shouldAutoplay, setShouldAutoplay] = useState(false);

   return (
      <section
         className="relative w-full py-16 sm:py-20 overflow-hidden"
         style={{
            background: "linear-gradient(to bottom, #fefce8, #1c1917)",
         }}
      >
         {/* Decorative top amber line */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 rounded-full bg-amber-500 opacity-60" />

         <div className="relative max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
            {/* Section header */}
            <div className="mb-10">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-[0.18em]">
                     Khám phá thêm
                  </span>
               </div>
               <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-white leading-tight flex items-center gap-3">
                  Trailers nổi bật
                  <Film size={28} className="text-amber-400 mb-0.5" />
               </h2>
               <p className="text-white/50 text-sm mt-2">
                  Khám phá những đoạn giới thiệu hấp dẫn từ các bộ phim hot nhất
               </p>
            </div>

            {/* Main player card */}
            <div
               className="rounded-2xl overflow-hidden mb-5"
               style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
            >
               <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                     key={currentVideo.id}
                     src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=${shouldAutoplay ? 1 : 0}&rel=0&modestbranding=1`}
                     title={currentVideo.title}
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                     className="absolute top-0 left-0 w-full h-full border-none"
                  />
               </div>
               {/* Caption bar */}
               <div
                  className="px-5 py-3 flex items-center gap-3"
                  style={{ background: "#18181b" }}
               >
                  <div
                     className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"
                     style={{ boxShadow: "0 0 8px rgba(245,158,11,0.8)" }}
                  />
                  <span className="text-white font-semibold text-sm truncate">
                     {currentVideo.title}
                  </span>
               </div>
            </div>

            {/* Thumbnail list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
               {videoData.map((video) => {
                  const isActive = video.id === currentVideo.id;
                  return (
                     <button
                        key={video.id}
                        onClick={() => {
                           setCurrentVideo(video);
                           setShouldAutoplay(true);
                        }}
                        className="text-left rounded-xl overflow-hidden transition-all duration-300 focus:outline-none group"
                        style={{
                           background: "#18181b",
                           border: isActive
                              ? "2px solid #f59e0b"
                              : "2px solid rgba(255,255,255,0.08)",
                           boxShadow: isActive
                              ? "0 0 24px rgba(245,158,11,0.3)"
                              : "none",
                           transform: isActive ? "scale(1.02)" : "scale(1)",
                        }}
                     >
                        {/* Thumbnail */}
                        <div className="relative w-full overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                           <img
                              src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                              alt={video.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              style={{ opacity: isActive ? 1 : 0.65 }}
                           />

                           {/* Overlay */}
                           <div
                              className="absolute inset-0 transition-opacity duration-300"
                              style={{
                                 background:
                                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                                 opacity: isActive ? 0.4 : 0.6,
                              }}
                           />

                           {/* Play icon */}
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                 className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                 style={{
                                    background: isActive
                                       ? "rgba(245,158,11,0.9)"
                                       : "rgba(0,0,0,0.55)",
                                    border: "1.5px solid rgba(255,255,255,0.4)",
                                 }}
                              >
                                 <Play
                                    size={14}
                                    fill="white"
                                    className="ml-0.5"
                                 />
                              </div>
                           </div>

                           {/* Active indicator */}
                           {isActive && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                           )}
                        </div>

                        {/* Title */}
                        <div className="px-2.5 py-2">
                           <p
                              className="text-xs font-semibold truncate leading-snug"
                              style={{ color: isActive ? "#f59e0b" : "rgba(255,255,255,0.7)" }}
                           >
                              {video.title}
                           </p>
                        </div>
                     </button>
                  );
               })}
            </div>
         </div>
      </section>
   );
};
