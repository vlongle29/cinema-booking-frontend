import { useState } from "react";
import { Plus, X } from "lucide-react";
import MovieList from "../../components/dashboard/movies/MovieList";
import MovieForm from "../../components/dashboard/movies/MovieForm";

export default function AddMovies() {
   const [isCreating, setIsCreating] = useState(false);

   const handleSuccess = () => {
      // Khi tạo phim thành công, tắt form đi.
      // MovieList khi được mount lại sẽ tự động fetch data mới nhất.
      setIsCreating(false);
   };

   return (
      <>
         <div className="mb-6 mt-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">
               {isCreating ? "Create " : "List "}
               <span className="underline decoration-[#f84565] text-[#f84565]">
                  Movie
               </span>
            </h1>
            
            {!isCreating ? (
               <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold rounded-[6px] transition-colors text-sm"
               >
                  <Plus className="w-4 h-4" />
                  Create Movie
               </button>
            ) : (
               <button
                  onClick={() => setIsCreating(false)}
                  className="text-[#d1d5dc] hover:text-white transition-colors text-sm flex items-center gap-1"
               >
                  <X className="w-4 h-4" /> Cancel
               </button>
            )}
         </div>

         {!isCreating ? (
            <MovieList onCreateClick={() => setIsCreating(true)} />
         ) : (
            <MovieForm onCancel={() => setIsCreating(false)} onSuccess={handleSuccess} />
         )}
      </>
   );
}