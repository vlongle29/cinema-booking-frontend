interface genres {
   id: string;
   name: string;
   description: string;
}

export interface Movie {
   id: string;
   title: string;
   director: string;
   releaseDate: string;
   description: string;
   genres: genres[];
   rating: number;
   year: number;
   duration: string;
   status: string;
   posterUrl: string;
   durationMinutes: number;
   cast: string;
   language: string;
   rated: string;
}

export interface FormData {
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
   genreIds: string[];
}

export interface Genre {
   id: string;
   name: string;
   description?: string;
}

export interface AgeRating {
   id: string;
   name: string;
   description?: string;
}
