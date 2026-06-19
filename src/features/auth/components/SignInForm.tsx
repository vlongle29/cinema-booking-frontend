import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import useAuth from "../hooks/useAuth";

interface SignInFormProps {
   onLoginSuccess: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onLoginSuccess }) => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
   const { login } = useAuth();

   const handleSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
         await login({ username, password });
         onLoginSuccess();
      } catch (err: any) {
         console.error("Login failed:", err);
         setError(
            err.response?.data?.message ||
               "Invalid credentials. Please try again.",
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <form className="flex flex-col" onSubmit={handleSignIn}>
         <h2 className="text-2xl mb-4 font-bold text-center text-white">
            Đăng nhập
         </h2>
         {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-md text-sm mb-4">
               {error}
            </div>
         )}
         <div className="relative mb-4">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
            <input
               type="text"
               placeholder="Tên đăng nhập"
               required
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="w-full py-2 px-4 pl-11 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-sm placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
            />
         </div>
         <div className="relative mb-4">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
            <input
               type={showPassword ? "text" : "password"}
               placeholder="Mật khẩu"
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full py-2 px-4 pl-11 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-sm placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
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
               Quên mật khẩu?
            </a>
         </div>
         <button
            type="submit"
            disabled={loading}
            className="p-2 bg-[#f84565] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#e03d5a] disabled:bg-gray-500 disabled:cursor-not-allowed"
         >
            {loading ? "Signing In..." : "Đăng nhập"}
         </button>
      </form>
   );
};

export default SignInForm;
