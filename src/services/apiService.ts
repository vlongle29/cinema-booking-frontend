import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import axiosInstance from "../api/axiosInstance";

/**
 * Interface for basic API response. Adjust according to your backend structure.
 */
export interface ApiResponse<T> {
   success: boolean;
   message: string;
   code: string;
   status: number;
   data: T;
}

export interface PageResponse<T> {
   content: T[];
   pageNumber: number;
   pageSize: number;
   totalElements: number;
   totalPages: number;
   first: boolean;
   last: boolean;
   empty: boolean;
}

export class ApiError extends Error {
   status?: number;
   code?: string;
   response?: {
      status?: number;
      data?: any;
   };

   constructor(
      message: string,
      status?: number,
      code?: string,
      data?: any,
   ) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.code = code;
      this.response = {
         status,
         data: data || { message, code, status },
      };
   }
}

/**
 * Helper function to handle API errors
 */
export const handleApiError = (error: unknown): never => {
   if (error instanceof AxiosError) {
      // Backend returned an error response
      if (error.response) {
         const { status, data } = error.response;
         const message =
            data?.message ||
            error.message ||
            "Có lỗi xảy ra từ máy chủ, vui lòng thử lại sau.";
         console.error(
            `[API Error] Status: ${status}, Message:`,
            message,
         );
         throw new ApiError(message, status, data?.code, data);
      } else if (error.request) {
         // The request was made but no response was received
         console.error("[API Error] No response received:", error.request);
         throw new ApiError(
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.",
         );
      }
   }
   // Something happened in setting up the request
   const fallbackMsg =
      error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.";
   console.error("[API Error] Setting up request:", fallbackMsg);
   throw new ApiError(fallbackMsg);
};

/**
 * Generic API Service containing all basic CRUD operations
 */
class ApiService {
   /**
    * GET Request
    */
   async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
      try {
         const response: AxiosResponse<ApiResponse<T>> =
            await axiosInstance.get(url, config);
         return response.data as any; // Adjust based on whether backend wraps data inside `data` property
      } catch (error) {
         return handleApiError(error);
      }
   }

   /**
    * POST Request
    */
   async post<T>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
   ): Promise<T> {
      try {
         const response: AxiosResponse<ApiResponse<T>> =
            await axiosInstance.post(url, data, config);
         return response.data as any;
      } catch (error) {
         return handleApiError(error);
      }
   }

   /**
    * PUT Request
    */
   async put<T>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
   ): Promise<T> {
      try {
         const response: AxiosResponse<ApiResponse<T>> =
            await axiosInstance.put(url, data, config);
         return response.data as any;
      } catch (error) {
         return handleApiError(error);
      }
   }

   /**
    * DELETE Request
    */
   async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
      try {
         const response: AxiosResponse<ApiResponse<T>> =
            await axiosInstance.delete(url, config);
         return response.data as any;
      } catch (error) {
         return handleApiError(error);
      }
   }
}

export default new ApiService();
