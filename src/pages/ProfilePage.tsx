import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Shield, Fingerprint, Lock, CheckCircle2, XCircle } from "lucide-react";
import { userApi } from "../services/user";
import type { UserInfoResponse } from "../types/user";
import { authService } from "@/services/authService";

export default function ProfilePage() {
   const [profile, setProfile] = useState<UserInfoResponse | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchProfile = async () => {
         try {
            const response = await authService.getCurrentUser();
            if (response.success && response.data) {
               setProfile(response.data);
            } else {
               setError("Không tìm thấy thông tin người dùng.");
            }
         } catch (err: any) {
            console.error("Lỗi khi tải hồ sơ:", err);
            setError("Đã xảy ra lỗi khi tải thông tin người dùng.");
         } finally {
            setLoading(false);
         }
      };
      
      fetchProfile();
   }, []);

   if (loading) {
      return (
         <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900">
            <div className="relative w-16 h-16">
               <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
               <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
         </div>
      );
   }

   if (error || !profile) {
      return (
         <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 p-4">
            <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-8 rounded-3xl shadow-lg border border-red-100 dark:border-red-900/30 flex flex-col items-center gap-5 max-w-md w-full text-center">
               <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full">
                  <XCircle className="w-12 h-12" />
               </div>
               <div>
                  <h3 className="text-xl font-bold mb-2">Không thể tải hồ sơ</h3>
                  <p className="text-slate-500 dark:text-slate-400">{error}</p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-[calc(100vh-64px)] mt-14 pt-4 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
         <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
               
               <div className="relative z-10 pt-16 flex flex-col items-center md:items-start w-full">
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                     <div className="w-36 h-36 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shrink-0 relative group-hover:shadow-indigo-500/20 transition-all duration-500">
                        {profile.avatar ? (
                           <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                           <span className="text-6xl font-bold text-indigo-300 dark:text-indigo-400">
                              {profile.name.charAt(0).toUpperCase()}
                           </span>
                        )}
                     </div>
                     
                     <div className="flex-1 text-center md:text-left space-y-3 mt-4 md:mt-0">
                        <div className="space-y-1">
                           <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                              {profile.name}
                           </h1>
                           <p className="text-lg text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
                              <span>@{profile.username}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                              <span className="text-sm">ID: {profile.id.split("-")[0]}...</span>
                           </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-3">
                           {profile.roles.map((role) => (
                              <div key={role.id} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-500/20 shadow-sm">
                                 <Shield className="w-4 h-4" />
                                 {role.name}
                              </div>
                           ))}
                           
                           {profile.lockFlag === "0" ? (
                              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/10 dark:ring-emerald-500/20 shadow-sm">
                                 <CheckCircle2 className="w-4 h-4" />
                                 Đang hoạt động
                              </div>
                           ) : (
                              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300 ring-1 ring-inset ring-red-600/10 dark:ring-red-500/20 shadow-sm">
                                 <Lock className="w-4 h-4" />
                                 Bị khóa
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* Column 1 */}
               <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-500 group">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <User className="w-6 h-6" />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Thông tin cá nhân</h2>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="group/item">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 group-hover/item:text-indigo-500 transition-colors">Họ và tên</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-200">{profile.name}</p>
                     </div>
                     <div className="h-px w-full bg-slate-100 dark:bg-slate-700/50"></div>
                     <div className="group/item">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 group-hover/item:text-indigo-500 transition-colors">Tên đăng nhập</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-200">{profile.username}</p>
                     </div>
                     <div className="h-px w-full bg-slate-100 dark:bg-slate-700/50"></div>
                     <div className="group/item">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 group-hover/item:text-indigo-500 transition-colors">ID hệ thống</p>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                           <p className="text-sm font-mono text-slate-600 dark:text-slate-400 break-all select-all">
                              {profile.id}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Column 2 */}
               <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-500 group">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <Fingerprint className="w-6 h-6" />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Liên hệ & Phân quyền</h2>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <div className="mt-1 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg">
                           <Mail className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Địa chỉ Email</p>
                           <p className="text-lg font-semibold text-slate-900 dark:text-slate-200">{profile.email}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <div className="mt-1 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg">
                           <Phone className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Số điện thoại</p>
                           <p className="text-lg font-semibold text-slate-900 dark:text-slate-200">
                              {profile.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <div className="mt-1 p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-lg">
                           <Shield className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">Loại tài khoản</p>
                           {profile.systemFlag === "1" ? (
                              <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 shadow-sm">
                                 Tài khoản Hệ thống
                              </div>
                           ) : (
                              <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-sm">
                                 Tài khoản Thường
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
}
