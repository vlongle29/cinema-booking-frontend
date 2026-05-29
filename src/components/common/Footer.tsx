import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
   return (
      <div>
         {/* Container chính: Đã áp dụng max-width và responsive padding/gap */}
         <footer className="mx-auto mt-[100px] max-w-[1300px] px-5 py-[30px] md:px-10 md:pb-10 md:pt-[60px]">
            {/* Grid chia cột: Responsive từ 1 cột (mobile) sang auto-fit (desktop) */}
            <div className="mx-auto mb-10 grid max-w-[1440px] grid-cols-1 gap-10 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] md:gap-[60px]">
               {/* Cột 1: Thông tin thương hiệu */}
               <div className="flex flex-col gap-4">
                  <div className="mb-2.5 flex items-center gap-2 text-[28px] font-semibold text-white">
                     <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl font-bold">
                        Q
                     </span>
                     <span>uickShow</span>
                  </div>
                  <p className="text-sm font-normal leading-[1.26] text-white/80">
                     Nền tảng đặt vé xem phim trực tuyến hàng đầu, mang đến cho
                     bạn trải nghiệm điện ảnh tuyệt vời nhất với quy trình đặt
                     vé nhanh chóng và tiện lợi.
                  </p>
               </div>

               {/* Cột 2: Liên kết Công ty */}
               <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold leading-[1.875] text-white">
                     Công ty
                  </h3>
                  <ul className="flex flex-col gap-3">
                     <li>
                        <Link
                           to="/"
                           className="text-sm font-normal text-white/80 transition-colors hover:text-[#f84565]"
                        >
                           Trang chủ
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="/movies"
                           className="text-sm font-normal text-white/80 transition-colors hover:text-[#f84565]"
                        >
                           Phim
                        </Link>
                     </li>
                     <li>
                        <a
                           href="#contact"
                           className="text-sm font-normal text-white/80 transition-colors hover:text-[#f84565]"
                        >
                           Liên hệ
                        </a>
                     </li>
                     <li>
                        <a
                           href="#privacy"
                           className="text-sm font-normal text-white/80 transition-colors hover:text-[#f84565]"
                        >
                           Chính sách bảo mật
                        </a>
                     </li>
                  </ul>
               </div>

               {/* Cột 3: Liên hệ */}
               <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold leading-[1.875] text-white">
                     Liên hệ
                  </h3>
                  <p className="text-sm font-normal leading-[2.14] text-white/80">
                     +1-212-456-7890
                  </p>
                  <p className="text-sm font-normal leading-[2.14] text-white/80">
                     contact@example.com
                  </p>
               </div>
            </div>

            {/* Phần link tải ứng dụng */}
            <div className="mb-10 flex flex-col gap-3">
               <div className="flex gap-3">
                  <img
                     src="/src/assets/images/Google Play.png"
                     alt="Google Play"
                     className="h-auto max-w-[100px] cursor-pointer transition-opacity hover:opacity-80"
                  />
                  <img
                     src="/src/assets/images/App Store.png"
                     alt="App Store"
                     className="h-auto max-w-[100px] cursor-pointer transition-opacity hover:opacity-80"
                  />
               </div>
            </div>

            {/* Footer Bottom (Bản quyền) */}
            <div className="border-t border-[#4b4f54] pt-5 text-center text-[15px] font-normal text-white/60">
               <p>Bản quyền 2025 © GreatStack. Tất cả các quyền được bảo hộ.</p>
            </div>
         </footer>
      </div>
   );
};

export default Footer;
