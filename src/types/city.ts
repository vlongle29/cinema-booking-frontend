export interface City {
   id: string;
   name: string;
   code: string;
   createTime?: string;
   updateTime?: string;
}

export interface CityRequest {
   name: string;
   code?: string;
}

export interface CitySearchDTO {
   keyword?: string;
   page: number;
   size: number;
   sortBy?: string;
   sortDirection?: "ASC" | "DESC";
}
