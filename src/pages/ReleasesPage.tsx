import React from "react";
import "../styles/HomePage.css";

const ReleasesPage: React.FC = () => {
   return (
      <div className="home-page">
         <section className="movies-section" style={{ marginTop: 100 }}>
            <div className="section-header">
               <h2>Coming Soon</h2>
            </div>
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
               <p>Upcoming releases. Coming soon.</p>
            </div>
         </section>
      </div>
   );
};

export default ReleasesPage;
