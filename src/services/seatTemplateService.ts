import type { Seat } from '../types/booking';
import apiService, { type ApiResponse } from './apiService';

// Thay bằng baseURL hoặc axios instance thực tế của dự án của bạn
const API_URL = '/seat-templates';

export const seatTemplateService = {
  // Get all templates
  getAllTemplates: async (): Promise<ApiResponse<any[]>> => {
    return apiService.get<ApiResponse<any[]>>(API_URL);
  },

  // Take a detail template with list of seats
  getTemplateById: async (id: string): Promise<ApiResponse<any>> => {
    return apiService.get<ApiResponse<any>>(`${API_URL}/${id}`);
  },

  // Create the template's basic information.
  createTemplate: async (data: any): Promise<ApiResponse<any>> => {
    return apiService.post<ApiResponse<any>>(API_URL, data);
  },

  // Save list of seats into template
  addSeatsToTemplate: async (templateId: string, seats: Seat[]): Promise<ApiResponse<any>> => {
    return apiService.post<ApiResponse<any>>(`${API_URL}/${templateId}/seats`, { seats });
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<ApiResponse<any>> => {
    return apiService.delete<ApiResponse<any>>(`${API_URL}/${id}`);
  },

  // Apply template into specific room
  applyTemplateToRoom: async (data: any): Promise<ApiResponse<any>> => {
    return apiService.post<ApiResponse<any>>(`${API_URL}/apply`, data);
  },

  // --- Helper APIs ---

  // Get list of seat types (Standard, VIP, Couple...)
  getSeatTypes: async (): Promise<ApiResponse<any[]>> => {
    return apiService.get<ApiResponse<any[]>>('/seat-types');
  },

  // Get list of rooms
  getRooms: async (): Promise<ApiResponse<any[]>> => {
    return apiService.get<ApiResponse<any[]>>('/room');
  }
};