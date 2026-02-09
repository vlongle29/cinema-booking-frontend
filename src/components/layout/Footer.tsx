import { Link } from "react-router-dom";
import "../../styles/Footer.css";

const Footer: React.FC = () => {
   return (
      <div>
         <footer className="footer">
            <div className="footer-content">
               <div className="footer-section">
                  <div className="footer-logo">
                     <span className="logo-icon">Q</span>
                     <span className="logo-text">uickShow</span>
                  </div>
                  <p className="footer-description">
                     Lorem Ipsum has been the industry's standard dummy text
                     ever since the 1500s, when an unknown printer took a galley
                     of type and scrambled it to make a type specimen book.
                  </p>
               </div>

               <div className="footer-section">
                  <h3>Company</h3>
                  <ul>
                     <li>
                        <Link to="/">Home</Link>
                     </li>
                     <li>
                        <Link to="/movies">Movies</Link>
                     </li>
                     <li>
                        <a href="#contact">Contact us</a>
                     </li>
                     <li>
                        <a href="#privacy">Privacy policy</a>
                     </li>
                  </ul>
               </div>

               <div className="footer-section">
                  <h3>Get in touch</h3>
                  <p>+1-212-456-7890</p>
                  <p>contact@example.com</p>
               </div>
            </div>

            <div className="footer-links-section">
               <div className="app-links">
                  <img
                     src="/src/assets/images/Google Play.png"
                     alt="Google Play"
                  />
                  <img src="/src/assets/images/App Store.png" alt="App Store" />
               </div>
            </div>

            <div className="footer-bottom">
               <p>Copyright 2025 © GreatStack. All Right Reserved.</p>
            </div>
         </footer>
      </div>
   );
};

export default Footer;
