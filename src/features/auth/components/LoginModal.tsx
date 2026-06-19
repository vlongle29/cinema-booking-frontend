import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import axios from "axios";

interface LoginModalProps {
   isOpen: boolean;
   onClose: () => void;
   onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
   isOpen,
   onClose,
   onLoginSuccess,
}) => {
   const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

   useEffect(() => {
      // Đặt lại mặc định về signin mỗi khi mở lại modal
      if (isOpen) {
         setAuthMode("signin");
      }
   }, [isOpen]);

   if (!isOpen) return null;

   const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
         onClose();
      }
   };

   const handleGoogleLogin = async () => {
      try {
         // Gọi xuống Backend để lấy URL chuẩn xác
         const response = await axios.get(
            "http://localhost:8080/api/auth/google/url",
         );
         const authUrl = response.data.data.url;

         // Chuyển hướng trình duyệt sang Google
         window.location.href = authUrl;
      } catch (error) {
         console.error("Lỗi khi lấy URL đăng nhập Google", error);
      }
   };

   return (
      <div
         className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] backdrop-blur-[5px] animate-[fadeIn_0.3s_ease-out]"
         onClick={handleOverlayClick}
      >
         <div className="bg-[#1a1a1d] text-[#c5c6c7] p-6 rounded-xl w-[90%] max-w-[360px] relative shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-white/10 animate-[slideIn_0.3s_ease-out] max-h-[90vh] overflow-y-auto">
            <button
               onClick={onClose}
               className="absolute top-4 right-4 bg-transparent border-none text-[#66fcf1] cursor-pointer p-2 rounded-full transition-colors duration-200 hover:bg-white/10"
            >
               <X size={24} />
            </button>

            {/* Toggle Switch */}
            <div className="flex justify-center mb-6 bg-[#0b0c10] rounded-full p-1 mt-4">
               <button
                  className={`flex-1 py-2 px-4 bg-transparent border-none font-semibold cursor-pointer rounded-full transition-all duration-300 ease-in-out ${
                     authMode === "signin"
                        ? "bg-[#f84565] text-white shadow-[0_2px_10px_rgba(248,69,101,0.4)]"
                        : "text-[#c5c6c7]"
                  }`}
                  onClick={() => setAuthMode("signin")}
               >
                  Đăng nhập
               </button>
               <button
                  className={`flex-1 py-2 px-4 bg-transparent border-none font-semibold cursor-pointer rounded-full transition-all duration-300 ease-in-out ${
                     authMode === "signup"
                        ? "bg-[#f84565] text-white shadow-[0_2px_10px_rgba(248,69,101,0.4)]"
                        : "text-[#c5c6c7]"
                  }`}
                  onClick={() => setAuthMode("signup")}
               >
                  Đăng ký
               </button>
            </div>

            {/* Form Rendering */}
            {authMode === "signin" ? (
               <SignInForm onLoginSuccess={onLoginSuccess} />
            ) : (
               <SignUpForm onSignUpSuccess={() => setAuthMode("signin")} />
            )}

            {/* Social Login */}
            <div className="flex items-center text-center my-6 text-[#99a1af] before:content-[''] before:flex-1 before:border-b before:border-[#45a29e] after:content-[''] after:flex-1 after:border-b after:border-[#45a29e]">
               <span className="px-4">Or continue with</span>
            </div>

            <div className="flex gap-4 mb-6">
               <button
                  className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-[#45a29e] bg-transparent text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-[#66fcf1]"
                  onClick={handleGoogleLogin}
               >
                  <FaGoogle />
                  <span>Google</span>
               </button>
               <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-[#45a29e] bg-transparent text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-[#66fcf1]">
                  <FaFacebook />
                  <span>Facebook</span>
               </button>
            </div>

            {/* Footer Text */}
            <div className="text-center text-sm">
               {authMode === "signin" ? (
                  <p className="text-[#99a1af]">
                     Bạn chưa có tài khoản?{" "}
                     <button
                        onClick={() => setAuthMode("signup")}
                        className="bg-none border-none text-[#66fcf1] font-semibold cursor-pointer p-0 hover:underline"
                     >
                        Đăng ký
                     </button>
                  </p>
               ) : (
                  <p className="text-[#99a1af]">
                     Đã có tài khoản?{" "}
                     <button
                        onClick={() => setAuthMode("signin")}
                        className="bg-none border-none text-[#66fcf1] font-semibold cursor-pointer p-0 hover:underline"
                     >
                        Đăng nhập
                     </button>
                  </p>
               )}
            </div>
         </div>
      </div>
   );
};

export default LoginModal;
