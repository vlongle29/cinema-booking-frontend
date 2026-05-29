import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const MainLayout: React.FC = () => {
   return (
      <div className="flex flex-col min-h-screen bg-[#09090b]">
         {/* Header dùng chung cho toàn bộ website khách hàng */}
         <Header />

         {/* Padding top để không bị Header fixed che mất nội dung */}
         <main className="flex-grow">
            <Outlet />
         </main>

         {/* Footer dùng chung từ file d:\Project.js\cine-book-app\src\layout\Footer.tsx */}
         <Footer />
      </div>
   );
};

export default MainLayout;
