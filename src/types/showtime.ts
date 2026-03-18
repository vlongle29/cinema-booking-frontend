export interface Movie {
   id: string;
   title: string;
   description: string;
   director: string;
   cast: string;
   durationMinutes: number;
   releaseDate: string;
   posterUrl: string;
   trailerUrl: string;
   language: string;
   rated: string;
   status: string;
   genres: any;
}

export interface Room {
   id: string;
   name: string;
   totalSeats: number;
   branchId: string;
   openTime: string | null;
   closeTime: string | null;
   createTime: string;
   updateTime: string;
}

export interface Branch {
   id: string;
   name: string;
   address: string;
   managerId: string;
   cityId: string;
   createTime: string;
   updateTime: string;
   updateBy: string;
}

export interface Showtime {
   id: string;
   movieId: string;
   roomId: string;
   branchId: string;
   startTime: string;
   endTime: string;
   price: number;
   format: string;
   status: string;
   movie: Movie;
   room: Room;
   branch: Branch;
   time: string;
   isPeak: boolean;
   isSoldOut: boolean;
   availableSeats: number;
}

export interface PaginatedResponse<T> {
   content: T[];
   pageNumber: number;
   pageSize: number;
   totalElements: number;
   totalPages: number;
   first: boolean;
   last: boolean;
   empty: boolean;
}

export interface ApiResponse<T> {
   success: boolean;
   message: string;
   code: string;
   status: number;
   data: T;
}

export interface ShowtimeSearchParams {
   movieId?: string;
   branchId?: string;
   roomId?: string;
   cityId?: string;
   date?: string;
   format?: string;
   page?: number;
   size?: number;
   sortBy?: string;
   searchTerm?: string;
   sortDirection?: string;
}


export interface DateOption {
   date: string;
   day: string;
   dateNum: number;
   fullDate: string;
}

export interface City {
   id: string;
   name: string;
   count: number;
}

export interface Format {
   id: string;
   name: string;
   badge?: string;
}

export interface Theater {
   id: string;
   name: string;
   location: string;
   showtimes: Showtime[];
}

export interface ApiState {
   loading: boolean;
   error: string | null;
}