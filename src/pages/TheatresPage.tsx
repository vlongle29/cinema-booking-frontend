import React from "react";
import "../styles/HomePage.css";

const TheatresPage: React.FC = () => {
   return (
      <div className="home-page">
         <section className="movies-section" style={{ marginTop: 100 }}>
            <div className="section-header">
               <h2>Theatres</h2>
            </div>
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
               <p>Find theatres near you. Coming soon.</p>
            </div>
         </section>
      </div>
   );
};

export default TheatresPage;
