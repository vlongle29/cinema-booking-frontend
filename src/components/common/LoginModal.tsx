import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

interface LoginModalProps {
   isOpen: boolean;
   onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
   const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
   const [showPassword, setShowPassword] = useState(false);

   if (!isOpen) return null;

   const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
         onClose();
      }
   };

   return (
      <div
         className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] backdrop-blur-[5px] animate-[fadeIn_0.3s_ease-out]"
         onClick={handleOverlayClick}
      >
         <div className="bg-[#1a1a1d] text-[#c5c6c7] p-8 rounded-xl w-[90%] max-w-[400px] relative shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-white/10 animate-[slideIn_0.3s_ease-out]">
            <button
               onClick={onClose}
               className="absolute top-4 right-4 bg-transparent border-none text-[#66fcf1] cursor-pointer p-2 rounded-full transition-colors duration-200 hover:bg-white/10"
            >
               <X size={24} />
            </button>

            <div className="flex justify-center mb-6 bg-[#0b0c10] rounded-full p-1">
               <button
                  className={`flex-1 py-2 px-4 bg-transparent border-none font-semibold cursor-pointer rounded-full transition-all duration-300 ease-in-out ${
                     authMode === "signin"
                        ? "bg-[#f84565] text-white shadow-[0_2px_10px_rgba(248,69,101,0.4)]"
                        : "text-[#c5c6c7]"
                  }`}
                  onClick={() => setAuthMode("signin")}
               >
                  Sign In
               </button>
               <button
                  className={`flex-1 py-2 px-4 bg-transparent border-none font-semibold cursor-pointer rounded-full transition-all duration-300 ease-in-out ${
                     authMode === "signup"
                        ? "bg-[#f84565] text-white shadow-[0_2px_10px_rgba(248,69,101,0.4)]"
                        : "text-[#c5c6c7]"
                  }`}
                  onClick={() => setAuthMode("signup")}
               >
                  Sign Up
               </button>
            </div>

            {authMode === "signin" ? (
               // Sign In Form
               <form className="flex flex-col">
                  <h2 className="text-3xl font-bold text-center text-white">
                     Sign In
                  </h2>
                  <p className="text-center mb-6 text-[#99a1af]">
                     to continue to QuickShow
                  </p>
                  <div className="relative mb-4">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full py-3 px-4 pl-12 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-base placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
                     />
                  </div>
                  <div className="relative mb-4">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        className="w-full py-3 px-4 pl-12 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-base placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#99a1af] cursor-pointer"
                     >
                        {showPassword ? <EyeOff /> : <Eye />}
                     </button>
                  </div>
                  <div className="flex justify-end mb-4">
                     <a
                        href="#"
                        className="text-[#66fcf1] text-sm no-underline hover:underline"
                     >
                        Forgot password?
                     </a>
                  </div>
                  <button
                     type="submit"
                     className="p-3 bg-[#f84565] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#e03d5a]"
                  >
                     Sign In
                  </button>
               </form>
            ) : (
               // Sign Up Form
               <form className="flex flex-col">
                  <h2 className="text-3xl font-bold text-center text-white">
                     Sign Up
                  </h2>
                  <p className="text-center mb-6 text-[#99a1af]">
                     to continue to QuickShow
                  </p>
                  <div className="relative mb-4">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full py-3 px-4 pl-12 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-base placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
                     />
                  </div>
                  <div className="relative mb-4">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full py-3 px-4 pl-12 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-base placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
                     />
                  </div>
                  <div className="relative mb-4">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        className="w-full py-3 px-4 pl-12 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-base placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#99a1af] cursor-pointer"
                     >
                        {showPassword ? <EyeOff /> : <Eye />}
                     </button>
                  </div>
                  <button
                     type="submit"
                     className="p-3 bg-[#f84565] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#e03d5a]"
                  >
                     Sign Up
                  </button>
               </form>
            )}

            <div className="flex items-center text-center my-6 text-[#99a1af] before:content-[''] before:flex-1 before:border-b before:border-[#45a29e] after:content-[''] after:flex-1 after:border-b after:border-[#45a29e]">
               <span className="px-4">Or continue with</span>
            </div>

            <div className="flex gap-4 mb-6">
               <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-[#45a29e] bg-transparent text-white font-semibold cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-[#66fcf1]">
                  <FaGoogle />
                  <span>Google</span>
               </button>
               <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-[#45a29e] bg-transparent text-white font-semibold cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-[#66fcf1]">
                  <FaFacebook />
                  <span>Facebook</span>
               </button>
            </div>

            <div className="text-center text-sm">
               {authMode === "signin" ? (
                  <p className="text-[#99a1af]">
                     Don't have an account?{" "}
                     <button
                        onClick={() => setAuthMode("signup")}
                        className="bg-none border-none text-[#66fcf1] font-semibold cursor-pointer p-0 hover:underline"
                     >
                        Sign Up
                     </button>
                  </p>
               ) : (
                  <p className="text-[#99a1af]">
                     Already have an account?{" "}
                     <button
                        onClick={() => setAuthMode("signin")}
                        className="bg-none border-none text-[#66fcf1] font-semibold cursor-pointer p-0 hover:underline"
                     >
                        Sign In
                     </button>
                  </p>
               )}
            </div>
         </div>
      </div>
   );
};

export default LoginModal;
