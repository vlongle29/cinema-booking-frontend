import React, { useState } from "react";

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
      <section className="w-full py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-10 bg-dark-bg">
         <div className="max-w-5xl mx-auto">
            <div className="text-lg sm:text-xl font-bold text-secondary mb-4 sm:mb-5">
               Trailers
            </div>
            <div className="w-full mx-auto flex flex-col gap-4 sm:gap-5 text-white">
               {/* Trình phát Video */}
               <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
                  <iframe
                     src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=${shouldAutoplay ? 1 : 0}`}
                     title={currentVideo.title}
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                     className="absolute top-0 left-0 w-full h-full border-none"
                  ></iframe>
               </div>

               {/* Danh sách Thumbnails */}
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {videoData.map((video) => (
                     <div
                        key={video.id}
                        className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 relative border-2 border-transparent bg-[#1a1c21] hover:scale-105 ${
                           video.id === currentVideo.id
                              ? "scale-105 border-primary"
                              : ""
                        }`}
                        onClick={() => {
                           setCurrentVideo(video);
                           setShouldAutoplay(true);
                        }}
                     >
                        <img
                           src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                           alt={video.title}
                           className={`w-full aspect-video object-cover transition-opacity duration-300 ${
                              video.id === currentVideo.id
                                 ? "opacity-100"
                                 : "opacity-70"
                           } hover:opacity-100`}
                        />
                        {/* Nút Play nhỏ ở giữa thumbnail */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center border-2 border-white pointer-events-none">
                           <div
                              className="absolute w-0 h-0"
                              style={{
                                 borderLeft: "14px solid white",
                                 borderTop: "8px solid transparent",
                                 borderBottom: "8px solid transparent",
                                 marginLeft: "4px",
                              }}
                           ></div>
                        </div>
                        <div className="p-2 text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                           {video.title}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
};
