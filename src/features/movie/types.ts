interface genres {
   id: string;
   name: string;
   description: string;
}

interface Movie {
   id: string;
   title: string;
   genre: string;
   year: string;
   durationMinutes: number;
   description: string;
   rating: number;
   image: string;
   posterUrl: string;
   releaseDate: string;
   genres: genres[];
}
export type { Movie };
