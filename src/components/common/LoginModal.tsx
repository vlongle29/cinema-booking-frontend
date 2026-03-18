import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

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
   const [showPassword, setShowPassword] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [name, setName] = useState("");
   const [username, setUsername] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [phone, setPhone] = useState("");
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
   const { login, register } = useAuth();

   useEffect(() => {
      // Reset fields and errors when switching modes or the modal is opened/closed
      setError(null);
      setShowPassword(false);
      setEmail("");
      setPassword("");
      setName("");
      setUsername("");
      setConfirmPassword("");
      setPhone("");
      setLoading(false);
   }, [authMode, isOpen]);

   if (!isOpen) return null;

   const handleSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
         // The API expects 'username', we are using email as username for the login
         await login({
            username: username,
            password: password,
         });
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

   const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      if (password !== confirmPassword) {
         setError("Passwords do not match.");
         return;
      }
      setError(null);
      setLoading(true);
      try {
         await register({
            username,
            password,
            confirmPassword,
            name,
            email,
            phone,
         });
         // Switch to sign-in mode after successful registration
         setAuthMode("signin");
      } catch (err: any) {
         console.error("Signup failed:", err);
         setError(
            err.response?.data?.message ||
               "An error occurred during sign up. Please try again.",
         );
      } finally {
         setLoading(false);
      }
   };

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
         <div className="bg-[#1a1a1d] text-[#c5c6c7] p-6 rounded-xl w-[90%] max-w-[360px] relative shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-white/10 animate-[slideIn_0.3s_ease-out]">
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
               <form className="flex flex-col" onSubmit={handleSignIn}>
                  <h2 className="text-2xl mb-4 font-bold text-center text-white">
                     Sign In
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
                        placeholder="Username"
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
                        placeholder="Password"
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
                        Forgot password?
                     </a>
                  </div>
                  <button
                     type="submit"
                     disabled={loading}
                     className="p-2 bg-[#f84565] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#e03d5a] disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                     {loading ? "Signing In..." : "Sign In"}
                  </button>
               </form>
            ) : (
               // Sign Up Form
               <form className="flex flex-col" onSubmit={handleSignUp}>
                  <h2 className="text-2xl mb-4 font-bold text-center text-white">
                     Sign Up
                  </h2>
                  {error && (
                     <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-md text-sm mb-4">
                        {error}
                     </div>
                  )}
                  <div className="relative mb-4">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full py-2 px-4 pl-11 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-sm placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
                     />
                  </div>
                  <div className="relative mb-4">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full py-2 px-4 pl-11 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-sm placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
                     />
                  </div>
                  <div className="relative mb-4">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-2 px-4 pl-11 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-sm placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
                     />
                  </div>
                  <div className="relative mb-4">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type="tel"
                        placeholder="Phone"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full py-2 px-4 pl-11 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-sm placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
                     />
                  </div>
                  <div className="relative mb-4">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
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
                  <div className="relative mb-4">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af] w-5 h-5" />
                     <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full py-2 px-4 pl-11 bg-[#0b0c10] border border-[#45a29e] rounded-lg text-white text-sm placeholder-[#99a1af] focus:outline-none focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30"
                     />
                  </div>
                  <button
                     type="submit"
                     disabled={loading}
                     className="p-2 bg-[#f84565] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#e03d5a] disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                     {loading ? "Signing Up..." : "Sign Up"}
                  </button>
               </form>
            )}

            <div className="flex items-center text-center my-6 text-[#99a1af] before:content-[''] before:flex-1 before:border-b before:border-[#45a29e] after:content-[''] after:flex-1 after:border-b after:border-[#45a29e]">
               <span className="px-4">Or continue with</span>
            </div>

            <div className="flex gap-4 mb-6">
               <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-[#45a29e] bg-transparent text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-[#66fcf1]">
                  <FaGoogle />
                  <span>Google</span>
               </button>
               <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-[#45a29e] bg-transparent text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-[#66fcf1]">
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
