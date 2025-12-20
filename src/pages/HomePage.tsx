import React, { useState } from "react";
import "../styles/HomePage.css";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { Star, Calendar, Clock, Play, ArrowRight } from "lucide-react";
import marvellogo from "../assets/icons/marvelLogo.svg";

interface Movie {
   id: number;
   title: string;
   genre: string;
   year: string;
   duration: string;
   rating: number;
   image: string;
}

// 1. Giả lập dữ liệu từ API (Sau này bạn gọi từ Spring Boot về)
const videoData = [
   { id: "WpW36ldAqnM", title: "Ironheart Official Trailer" },
   { id: "-sAOWhvheK8", title: "Thunderbolts* Final Trailer" },
   { id: "1pHDWnXmK7Y", title: "Captain America: BNW" },
   { id: "umiKiW4En9g", title: "What If...? Season 3" },
];

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

const moreMovies: Movie[] = [
   {
      id: 5,
      title: "Alita Battle Angel",
      genre: "Action, Adventure",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/alita4.jpg",
   },
   {
      id: 6,
      title: "Alita Battle Angel",
      genre: "Action, Adventure",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/alita5.jpg",
   },
];

const HomePage: React.FC = () => {
   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
   // 2. State lưu video đang được chọn (mặc định lấy video đầu tiên)
   const [currentVideo, setCurrentVideo] = useState(videoData[0]);

   return (
      <div className="home-page">
         {/* Navigation Bar */}
         <Header />

         {/* Hero Section */}
         <section className="hero">
            <div className="hero-background">
               <img
                  src="/src/assets/images/hero-bg.jpg"
                  alt="Hero Background"
               />
               <div className="hero-overlay"></div>
            </div>

            <div className="hero-content">
               <div className="hero-logo">
                  <img src={marvellogo} alt="Marvel" />
               </div>

               <h1 className="hero-title">
                  Guardians
                  <br />
                  of the Galaxy
               </h1>

               <p className="hero-genre">Action | Adventure | Sci-Fi</p>

               <p className="hero-description">
                  In a post-apocalyptic world where cities ride on wheels and
                  consume each other to survive, two people meet in London and
                  try to stop a conspiracy.
               </p>

               <div className="hero-info">
                  <div className="info-item">
                     <Calendar size={18} />
                     <span>2018</span>
                  </div>
                  <div className="info-item">
                     <Clock size={18} />
                     <span>2h 8m</span>
                  </div>
               </div>

               <div className="hero-buttons">
                  <button className="btn btn-primary">Explore Movies</button>
                  <button className="btn btn-secondary">
                     <Play size={18} />
                     Watch Trailer
                  </button>
               </div>
            </div>
         </section>

         {/* Now Showing Section */}
         <section className="movies-section">
            <div className="section-header">
               <h2>Now Showing</h2>
               <a href="#view-all" className="view-all">
                  View All <ArrowRight size={16} />
               </a>
            </div>

            <div className="movies-grid">
               {nowShowingMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
               ))}
            </div>

            <div className="show-more-container">
               <button className="show-more-btn">Show more</button>
            </div>
         </section>

         {/* Trailers Section */}
         <section className="trailers-section">
            <div className="trailers-container">
               <div className="trailer-title">Trailers</div>
               <div className="gallery-container">
                  {/* --- PHẦN 1: VIDEO PLAYER CHÍNH --- */}
                  <div className="main-video-wrapper">
                     <iframe
                        src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
                        title={currentVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                     ></iframe>
                  </div>

                  {/* --- PHẦN 2: DANH SÁCH THUMBNAIL --- */}
                  <div className="thumbnail-list">
                     {videoData.map((video) => (
                        <div
                           key={video.id}
                           // Logic: Nếu id của item trùng với id đang chọn thì thêm class 'active'
                           className={`thumbnail-item ${
                              video.id === currentVideo.id ? "active" : ""
                           }`}
                           onClick={() => setCurrentVideo(video)}
                        >
                           <img
                              src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                              alt={video.title}
                           />
                           <div className="play-icon"></div>
                           <div className="video-title">{video.title}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* Footer */}
         <Footer />
      </div>
   );
};

// Movie Card Component
const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
   return (
      <div className="movie-card">
         <div className="movie-image">
            <img src={movie.image} alt={movie.title} />
         </div>

         <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-meta">
               {movie.year} - {movie.genre} - {movie.duration}
            </p>

            <div className="movie-footer">
               <div className="movie-rating">
                  <Star size={18} fill="#F84565" stroke="#F84565" />
                  <span>{movie.rating}</span>
               </div>
               <button className="buy-ticket-btn">Buy Ticket</button>
            </div>
         </div>
      </div>
   );
};

export default HomePage;
