import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Movie } from "../features/movie/types";
import MovieCard from "../features/movie/conponents/MovieCard";

// Sample movie data
const nowShowingMovies: Movie[] = [
   {
      id: 1,
      title: "Guardians of the Galaxy",
      genre: "Action | Adventure | Sci-Fi",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/guardians.jpg",
   },
   {
      id: 2,
      title: "Alita Battle Angel",
      genre: "Action, Adventure",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/alita1.jpg",
   },
   {
      id: 3,
      title: "Alita Battle Angel",
      genre: "Action, Adventure",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/alita2.jpg",
   },
   {
      id: 4,
      title: "Alita Battle Angel",
      genre: "Action, Adventure",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/alita3.jpg",
   },
];

function NowShowingPage() {
   return (
      <section className="max-w-7xl mx-auto py-[60px] px-10 mt-16">
         <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold text-secondary font-outfit">
               Now Showing
            </h2>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {nowShowingMovies.map((movie) => (
               <MovieCard key={movie.id} movie={movie} />
            ))}
         </div>
      </section>
   );
}

export default NowShowingPage;
