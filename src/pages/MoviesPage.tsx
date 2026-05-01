import { ArrowLeft } from "lucide-react";
import React, { useRef } from "react";
import { FaStar } from "react-icons/fa";
import { IoPlayCircle } from "react-icons/io5";
import ShowtimeSelection from "./ShowtimeSelection";
import guardiansImg from "../assets/images/phim-kinh-di.png";

// Image assets from localhost
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

export default function TicketBookingDetailPage() {
   const showtimeSectionRef = useRef<HTMLDivElement>(null);

   const castMembers = [
      { name: "Chris Pratt", role: "Peter Quill", image: images.castMember1 },
      { name: "Chris Pratt", role: "Peter Quill", image: images.castMember2 },
      { name: "Chris Pratt", role: "Peter Quill", image: images.castMember3 },
      { name: "Chris Pratt", role: "Peter Quill", image: images.castMember4 },
      { name: "Chris Pratt", role: "Peter Quill", image: images.castMember5 },
      { name: "Chris Pratt", role: "Peter Quill", image: images.castMember6 },
      { name: "Chris Pratt", role: "Peter Quill", image: images.castMember7 },
   ];

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

   const handleBuyTicketClick = () => {
      if (showtimeSectionRef.current) {
         const offset = 100; // muốn cách top 100px
         const elementPosition =
            showtimeSectionRef.current.getBoundingClientRect().top;
         const offsetPosition = elementPosition + window.pageYOffset - offset;

         window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
         });
      }
   };

   return (
      <div className="bg-[#09090b] min-h-screen text-white">
         {/* Movie Details Section */}
         <section className="mt-36 max-w-7xl px-8 py-12 flex gap-12 inset-0 mx-auto">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
               <img
                  src={images.guardians}
                  alt="Guardians of the Galaxy"
                  className="w-[278px] h-[417px] rounded-[18px] object-cover"
               />
            </div>

            {/* Movie Info */}
            <div className="flex-1">
               <span className="text-[#f84565] text-sm font-semibold tracking-wider">
                  ENGLISH
               </span>
               <h1 className="text-5xl font-bold mt-3 mb-6">
                  Guardians
                  <br />
                  of the Galaxy
               </h1>

               <div className="flex items-center gap-4 mb-6">
                  <FaStar size={24} className="text-[#f84565]" />
                  <span className="text-sm text-[#d1d5dc]">
                     4.5 IMDb Rating
                  </span>
               </div>

               <p className="text-[#99a1af] text-sm leading-relaxed mb-4 max-w-2xl">
                  From the Marvel Cinematic Universe comes an epic space
                  adventure. Peter Quill, a brash space adventurer who calls
                  himself Star-Lord, finds himself the target of relentless
                  bounty hunters after stealing a mysterious orb. To evade
                  capture, he forms an uneasy alliance with a group of misfits:
                  Gamora, Drax the Destroyer, Rocket Raccoon, and Groot.
               </p>

               <p className="text-[#d1d5dc] text-sm mb-6">
                  2h 19m • Action | Adventure • 1 May, 2025
               </p>

               {/* Action Buttons */}
               <div className="flex gap-4">
                  <button className="flex items-center gap-2 border border-[rgba(248,69,101,0.3)] px-6 py-3 rounded-lg text-white font-semibold">
                     <IoPlayCircle size={20} />
                     Watch Trailer
                  </button>
                  <button
                     onClick={handleBuyTicketClick}
                     className="bg-[#f84565] px-6 py-3 rounded-lg text-white font-semibold"
                  >
                     Buy Tickets
                  </button>
               </div>
            </div>
         </section>
         {/* Cast Section */}
         {/* <section className="px-8 py-12 max-w-7xl inset-0 mx-auto">
            <h2 className="text-lg font-medium mb-6">Your Favorite Cast</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
               {castMembers.map((member, idx) => (
                  <div key={idx} className="flex-shrink-0 text-center">
                     <img
                        src={member.image}
                        alt={member.name}
                        className="w-[102px] h-[102px] rounded-full object-cover mb-3"
                     />
                     <p className="text-sm font-semibold text-white">
                        {member.name}
                     </p>
                     <p className="text-xs text-[#b7b7b7]">{member.role}</p>
                  </div>
               ))}
            </div>
         </section> */}
         {/* Date Selection Section */}
         <div ref={showtimeSectionRef}>
            <ShowtimeSelection />
         </div>
         {/* Recommendations Section */}
         <section className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-[#d1d5dc]">
                  You May Also Like
               </h2>
               <a
                  href=""
                  className="text-sm text-[#99a1af] flex items-center gap-2"
               >
                  View All
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
                              Buy Ticket
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
                  Show more
               </button>
            </div>
         </section>
      </div>
   );
}
