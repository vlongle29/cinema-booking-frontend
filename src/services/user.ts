import axios from "axios";
import type {
   ApiResponse,
   PageResponse,
   UserInfoResponse,
   SysUserSearchDTO,
   UserCreateRequest,
   UserUpdateRequest,
   UserIdRequest,
} from "../types/user";

const API_URL = "http://localhost:8080/api";

// Giả định bạn có cách lấy token (ví dụ từ localStorage hoặc Clerk)
const getAuthHeader = () => ({
   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const userApi = {
   search: (params: SysUserSearchDTO) =>
      axios.post<ApiResponse<PageResponse<UserInfoResponse>>>(
         `${API_URL}/users/search`,
         params,
         getAuthHeader(),
      ),

   create: (data: UserCreateRequest) =>
      axios.post<ApiResponse<UserInfoResponse>>(
         `${API_URL}/users`,
         data,
         getAuthHeader(),
      ),

   update: (id: string, data: UserUpdateRequest) =>
      axios.put<ApiResponse<UserInfoResponse>>(
         `${API_URL}/users/${id}`,
         data,
         getAuthHeader(),
      ),

   getById: (id: string) =>
      axios.get<ApiResponse<UserInfoResponse>>(
         `${API_URL}/users/${id}`,
         getAuthHeader(),
      ),

   delete: (data: UserIdRequest) =>
      axios.delete<ApiResponse<void>>(`${API_URL}/users`, {
         ...getAuthHeader(),
         data,
      }),

   lock: (data: UserIdRequest) =>
      axios.post<ApiResponse<number>>(
         `${API_URL}/users/lock`,
         data,
         getAuthHeader(),
      ),

   unlock: (data: UserIdRequest) =>
      axios.post<ApiResponse<number>>(
         `${API_URL}/users/unlock`,
         data,
         getAuthHeader(),
      ),

   resetPassword: (email: string) =>
      axios.post<ApiResponse<void>>(
         `${API_URL}/users/reset-password-user`,
         { email },
         getAuthHeader(),
      ),
};
