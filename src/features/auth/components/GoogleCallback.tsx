import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance, { setAccessToken } from "../../../api/axiosInstance";
import useAuth from "../hooks/useAuth";

const GoogleOAuth2Callback: React.FC = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { setAuthData } = useAuth();
   const hasFetched = useRef(false); // Tránh gọi API 2 lần do React StrictMode

   useEffect(() => {
      const fetchJwtToken = async () => {
         // 1. Lấy mã 'code' từ thanh địa chỉ URL
         const searchParams = new URLSearchParams(location.search);
         const code = searchParams.get("code");

         if (code && !hasFetched.current) {
            hasFetched.current = true;
            try {
               // 2. Ném 'code' xuống Backend xử lý thông qua axiosInstance để đồng bộ config
               const response = await axiosInstance.post(
                  "/auth/google/callback",
                  {
                     code: code,
                  },
               );

               console.log(">>> [GoogleCallback] response.data:", response.data);

               // Lấy từ data.data hoặc data tùy cấu trúc backend
               const payload = response.data?.data || response.data;
               console.log(">>> [GoogleCallback] payload:", payload);
               
               const { accessToken, userInfo, permissions } = payload;

               if (!accessToken) {
                  throw new Error("Không nhận được access token từ server");
               }

               // Cập nhật cả Axios token và React State cùng lúc
               setAuthData({
                  accessToken: accessToken,
                  userInfo: userInfo,
                  permissions: permissions || [],
               });

               navigate("/");
            } catch (error) {
               console.error("Lỗi xác thực:", error);
               // alert("Lỗi đăng nhập");
               navigate("/");
            }
         }
      };

      fetchJwtToken();
   }, [location, navigate]);

   return (
      <div className="flex justify-center items-center h-screen">
         <h2>Đang xử lý đăng nhập... Vui lòng đợi.</h2>
      </div>
   );
};

export default GoogleOAuth2Callback;
