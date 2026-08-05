import React from "react";
import { Link } from "react-router-dom";
import { Film, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";

const Footer: React.FC = () => {
   return (
      <footer className="relative mt-20 border-t border-amber-200 bg-[#fefce8] pt-16 overflow-hidden">
         {/* Background Effects */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none" />

         <div className="mx-auto max-w-[1300px] px-5 md:px-10">
            {/* Top Section */}
            <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
               
               {/* Column 1: Brand & About */}
               <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2.5">
                     <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                        <Film className="text-white" size={24} />
                     </div>
                     <span className="text-2xl font-bold tracking-tight text-amber-950">
                        CineBook
                     </span>
                  </div>
                  <p className="text-sm leading-relaxed text-amber-700/80">
                     Nền tảng đặt vé xem phim trực tuyến hàng đầu. Trải nghiệm điện ảnh đỉnh cao với quy trình đặt vé siêu tốc và an toàn.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                     <SocialIcon icon={<Facebook size={18} />} href="#" />
                     <SocialIcon icon={<Instagram size={18} />} href="#" />
                     <SocialIcon icon={<Twitter size={18} />} href="#" />
                     <SocialIcon icon={<Youtube size={18} />} href="#" />
                  </div>
               </div>

               {/* Column 2: Quick Links */}
               <div className="flex flex-col gap-5 lg:px-8">
                  <h3 className="text-lg font-semibold text-amber-900">Khám phá</h3>
                  <ul className="flex flex-col gap-3.5">
                     <FooterLink to="/" label="Trang chủ" />
                     <FooterLink to="/movies" label="Phim đang chiếu" />
                     <FooterLink to="/cinemas" label="Cụm rạp" />
                     <FooterLink to="/promotions" label="Khuyến mãi" />
                     <FooterLink to="/news" label="Tin tức điện ảnh" />
                  </ul>
               </div>

               {/* Column 3: Contact */}
               <div className="flex flex-col gap-5">
                  <h3 className="text-lg font-semibold text-amber-900">Liên hệ</h3>
                  <ul className="flex flex-col gap-4">
                     <li className="flex items-start gap-3 text-sm text-amber-800">
                        <MapPin size={18} className="text-amber-500 shrink-0 mt-0.5" />
                        <span>Khu Công nghệ cao, Phường Tân Phú, Quận 9, TP.Hồ Chí Minh</span>
                     </li>
                     <li className="flex items-center gap-3 text-sm text-amber-800">
                        <Phone size={18} className="text-amber-500 shrink-0" />
                        <span>1900 1234 (Hỗ trợ 24/7)</span>
                     </li>
                     <li className="flex items-center gap-3 text-sm text-amber-800">
                        <Mail size={18} className="text-amber-500 shrink-0" />
                        <span>support@quickshow.vn</span>
                     </li>
                  </ul>
               </div>

               {/* Column 4: Newsletter */}
               <div className="flex flex-col gap-5">
                  <h3 className="text-lg font-semibold text-amber-900">Đăng ký nhận tin</h3>
                  <p className="text-sm text-amber-700/80">
                     Nhận thông tin về các bộ phim bom tấn và ưu đãi độc quyền sớm nhất.
                  </p>
                  <form className="relative mt-2 flex items-center" onSubmit={(e) => e.preventDefault()}>
                     <input 
                        type="email" 
                        placeholder="Nhập email của bạn..." 
                        className="w-full rounded-full border border-amber-200 bg-white py-3 pl-4 pr-12 text-sm text-amber-950 placeholder-amber-400/80 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                     />
                     <button 
                        type="submit" 
                        className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white transition-transform hover:scale-105 hover:bg-amber-600 shadow-sm"
                     >
                        <ArrowRight size={16} />
                     </button>
                  </form>
                  <div className="mt-4 flex gap-3">
                     <img
                        src="/src/assets/images/Google Play.png"
                        alt="Google Play"
                        className="h-[36px] w-auto cursor-pointer transition-transform hover:scale-105"
                     />
                     <img
                        src="/src/assets/images/App Store.png"
                        alt="App Store"
                        className="h-[36px] w-auto cursor-pointer transition-transform hover:scale-105"
                     />
                  </div>
               </div>
               
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col items-center justify-between border-t border-amber-200 py-6 md:flex-row">
               <p className="text-sm text-amber-700">
                  © {new Date().getFullYear()} QuickShow. Bản quyền thuộc về đội ngũ phát triển.
               </p>
               <div className="mt-4 flex gap-6 text-sm text-amber-700 md:mt-0">
                  <a href="#privacy" className="transition-colors hover:text-amber-600">Chính sách bảo mật</a>
                  <a href="#terms" className="transition-colors hover:text-amber-600">Điều khoản dịch vụ</a>
                  <a href="#faq" className="transition-colors hover:text-amber-600">Câu hỏi thường gặp</a>
               </div>
            </div>
         </div>
      </footer>
   );
};

// Helper Components
const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
   <a 
      href={href} 
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-amber-100 text-amber-700 transition-all hover:-translate-y-1 hover:bg-amber-500 hover:border-amber-500 hover:text-white shadow-sm"
   >
      {icon}
   </a>
);

const FooterLink = ({ to, label }: { to: string; label: string }) => (
   <li>
      <Link 
         to={to} 
         className="group flex items-center text-sm text-amber-700 transition-colors hover:text-amber-600"
      >
         <span className="mr-2 opacity-0 transition-all group-hover:opacity-100 group-hover:mr-3 text-amber-500">›</span>
         {label}
      </Link>
   </li>
);

export default Footer;
