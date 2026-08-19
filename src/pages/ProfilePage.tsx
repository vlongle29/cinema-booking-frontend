import React, { useEffect, useState } from "react";
import {
   User,
   Mail,
   Phone,
   Shield,
   Lock,
   CheckCircle2,
   ChevronRight,
   Camera,
   Ticket,
   Settings,
   LogOut,
   Star,
   Clock,
} from "lucide-react";
import type { UserInfoResponse } from "../types/user";
import { authService } from "@/services/authService";

// ── helpers ────────────────────────────────────────────────────────────────────

function initials(name?: string) {
   if (!name) return "?";
   const parts = name.trim().split(" ");
   return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
}

function formatPhone(phone?: string) {
   if (!phone) return "Chưa cập nhật";
   return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
}

// ── sub-components ─────────────────────────────────────────────────────────────

interface InfoRowProps {
   label: string;
   value: React.ReactNode;
   icon: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => (
   <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
      <div
         className="w-9 h-9 flex items-center justify-center flex-shrink-0"
         style={{ background: "rgba(245,158,11,0.1)" }}
      >
         <span className="text-amber-500">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
         <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
         <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
      </div>
   </div>
);

interface NavItemProps {
   icon: React.ReactNode;
   label: string;
   sublabel?: string;
   accent?: boolean;
   onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, sublabel, accent, onClick }) => (
   <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-all duration-200 bg-slate-50 group hover:bg-slate-100"
   >
      <div
         className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-colors"
         style={{
            background: accent ? "rgba(245,158,11,0.12)" : "rgba(100,116,139,0.08)",
         }}
      >
         <span className={accent ? "text-amber-500" : "text-slate-500"}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
         <p
            className={`text-sm font-semibold ${accent ? "text-amber-600" : "text-slate-700"}`}
         >
            {label}
         </p>
         {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
      </div>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
   </button>
);

// ── main component ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
   const [profile, setProfile] = useState<UserInfoResponse | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      authService
         .getCurrentUser()
         .then((res) => {
            if (res.success && res.data) {
               setProfile(res.data.userInfo || res.data);
            } else {
               setError("Không tìm thấy thông tin người dùng.");
            }
         })
         .catch(() => setError("Không thể kết nối đến máy chủ."))
         .finally(() => setLoading(false));
   }, []);

   // ── loading ──
   if (loading) {
      return (
         <div
            className="flex justify-center items-center"
            style={{ minHeight: "calc(100vh - 64px)", background: "#fafafa" }}
         >
            <div className="flex flex-col items-center gap-4">
               <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-[3px] border-amber-100 " />
                  <div className="absolute inset-0 border-[3px] border-amber-500 border-t-transparent animate-spin" />
               </div>
               <p className="text-sm text-slate-400 font-medium">Đang tải hồ sơ…</p>
            </div>
         </div>
      );
   }

   // ── error ──
   if (error || !profile) {
      return (
         <div
            className="flex justify-center items-center p-6"
            style={{ minHeight: "calc(100vh - 64px)", background: "#fafafa" }}
         >
            <div className="text-center max-w-xs">
               <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <Lock size={24} className="text-red-400" />
               </div>
               <h3 className="text-base font-bold text-slate-800 mb-1">Không thể tải hồ sơ</h3>
               <p className="text-sm text-slate-400">{error}</p>
            </div>
         </div>
      );
   }

   const isActive = profile.lockFlag === "0";
   const isSystem = profile.systemFlag === "1";

   // ── main render ──
   return (
      <div
         className="min-h-screen pt-16 pb-12"
         style={{ background: "#f5f5f7" }}
      >
         {/* ── Page header strip ── */}
         <div
            className="w-full py-10 px-4"
            style={{
               background: "linear-gradient(135deg, #1c1917 0%, #292524 60%, #1c1917 100%)",
            }}
         >
            <p className="text-center text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-1">
               Tài khoản của tôi
            </p>
            <h1 className="text-center text-2xl font-extrabold text-white tracking-tight">
               Hồ sơ cá nhân
            </h1>
         </div>

         {/* ── Layout wrapper ── */}
         <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">

               {/* ════ LEFT SIDEBAR ════ */}
               <div className="space-y-4">

                  {/* Avatar card */}
                  <div
                     className="overflow-hidden"
                     style={{ background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                  >
                     {/* Amber strip */}
                     <div
                        className="h-20 w-full"
                        style={{
                           background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
                        }}
                     />

                     {/* Avatar */}
                     <div className="flex flex-col items-center -mt-12 pb-6 px-6">
                        <div className="relative mb-3">
                           <div
                              className="w-24 h-24 border-4 border-white flex items-center justify-center overflow-hidden"
                              style={{
                                 boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                                 background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                              }}
                           >
                              {profile.avatar ? (
                                 <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                 />
                              ) : (
                                 <span className="text-3xl font-extrabold text-amber-500">
                                    {initials(profile.name)}
                                 </span>
                              )}
                           </div>
                           {/* Camera button */}
                           <button
                              className="absolute bottom-0 right-0 w-7 h-7 bg-white flex items-center justify-center shadow-md hover:bg-amber-50 transition-colors"
                              title="Đổi ảnh đại diện"
                              onClick={() => alert("Tính năng đang phát triển")}
                           >
                              <Camera size={14} className="text-slate-500" />
                           </button>
                        </div>

                        <h2 className="text-base font-bold text-slate-900 text-center leading-tight">
                           {profile.name}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">@{profile.username}</p>

                        {/* Status badge */}
                        <div className="mt-3 flex items-center gap-1.5">
                           {isActive ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 ">
                                 <CheckCircle2 size={11} />
                                 Đang hoạt động
                              </span>
                           ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 ">
                                 <Lock size={11} />
                                 Bị khóa
                              </span>
                           )}
                           {isSystem && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 ">
                                 <Shield size={11} />
                                 Hệ thống
                              </span>
                           )}
                        </div>
                     </div>

                     {/* Role list */}
                     {profile.roles?.length > 0 && (
                        <div className="border-t border-slate-100 px-5 py-4">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                              Vai trò
                           </p>
                           <div className="flex flex-wrap gap-1.5">
                              {profile.roles.map((role) => (
                                 <span
                                    key={role.id}
                                    className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 "
                                 >
                                    {role.name}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Quick stats */}
                  <div
                     className=" p-4 grid grid-cols-3 gap-2"
                     style={{ background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                  >
                     {[
                        { label: "Vé đã đặt", value: "—", icon: <Ticket size={16} /> },
                        { label: "Phim yêu thích", value: "—", icon: <Star size={16} /> },
                        { label: "Tháng này", value: "—", icon: <Clock size={16} /> },
                     ].map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center gap-1 py-2">
                           <span className="text-amber-400">{stat.icon}</span>
                           <span className="text-lg font-extrabold text-slate-800">{stat.value}</span>
                           <span className="text-[10px] text-slate-400 text-center leading-tight">{stat.label}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* ════ RIGHT CONTENT ════ */}
               <div className="space-y-4">

                  {/* Personal info card */}
                  <div
                     className=" p-6"
                     style={{ background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                  >
                     <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold text-slate-800">Thông tin cá nhân</h2>
                        <button className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors">
                           Chỉnh sửa
                        </button>
                     </div>
                     <p className="text-xs text-slate-400 mb-4">
                        Thông tin hiển thị trên hồ sơ và vé điện tử của bạn.
                     </p>

                     <InfoRow
                        label="Họ và tên"
                        value={profile.name}
                        icon={<User size={15} />}
                     />
                     <InfoRow
                        label="Tên đăng nhập"
                        value={`@${profile.username}`}
                        icon={<User size={15} />}
                     />
                     <InfoRow
                        label="Địa chỉ email"
                        value={profile.email || "Chưa cập nhật"}
                        icon={<Mail size={15} />}
                     />
                     <InfoRow
                        label="Số điện thoại"
                        value={formatPhone(profile.phone)}
                        icon={<Phone size={15} />}
                     />
                  </div>

                  {/* Account settings card */}
                  <div
                     className=" overflow-hidden"
                     style={{ background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                  >
                     <div className="px-6 pt-5 pb-3">
                        <h2 className="text-sm font-bold text-slate-800">Cài đặt tài khoản</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Quản lý bảo mật và tuỳ chọn tài khoản.</p>
                     </div>

                     <div className="px-3 pb-3 space-y-1">
                        <NavItem
                           icon={<Lock size={18} />}
                           label="Đổi mật khẩu"
                           sublabel="Cập nhật mật khẩu để bảo vệ tài khoản"
                           accent
                           onClick={() => alert("Tính năng đang được phát triển!")}
                        />
                        <NavItem
                           icon={<Ticket size={18} />}
                           label="Lịch sử đặt vé"
                           sublabel="Xem toàn bộ vé bạn đã đặt"
                           onClick={() => alert("Tính năng đang được phát triển!")}
                        />
                        <NavItem
                           icon={<Settings size={18} />}
                           label="Cài đặt thông báo"
                           sublabel="Tuỳ chỉnh thông báo email và ứng dụng"
                           onClick={() => alert("Tính năng đang được phát triển!")}
                        />
                     </div>

                     {/* Divider */}
                     <div className="mx-6 border-t border-slate-100 my-1" />

                     <div className="px-3 pb-3">
                        <NavItem
                           icon={<LogOut size={18} />}
                           label="Đăng xuất"
                           onClick={() => alert("Tính năng đang được phát triển!")}
                        />
                     </div>
                  </div>

                  {/* Security status bar */}
                  <div
                     className=" p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                     style={{
                        background: "linear-gradient(135deg, #1c1917, #292524)",
                        boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
                     }}
                  >
                     <div className="flex items-center gap-3 flex-1">
                        <div
                           className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                           style={{ background: "rgba(245,158,11,0.15)" }}
                        >
                           <Shield size={20} className="text-amber-400" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-white">Bảo mật tài khoản</p>
                           <p className="text-xs text-slate-400 mt-0.5">
                              Đổi mật khẩu thường xuyên để bảo vệ tài khoản tốt hơn.
                           </p>
                        </div>
                     </div>
                     <button
                        onClick={() => alert("Tính năng đang được phát triển!")}
                        className="flex-shrink-0 px-5 py-2.5 text-sm font-bold text-stone-900 transition-all duration-200 hover:brightness-110 active:scale-95"
                        style={{
                           background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                           boxShadow: "0 4px 14px rgba(245,158,11,0.4)",
                        }}
                     >
                        Đổi mật khẩu
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
