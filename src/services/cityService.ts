import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

export interface City {
   id: string;
   name: string;
   code: string;
}

const CITY_API_PATH = "/cities";

export const cityService = {
   getAll: () => apiService.get<ApiResponse<City[]>>(CITY_API_PATH),
};
