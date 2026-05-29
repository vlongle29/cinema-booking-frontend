import { useState, useMemo } from "react";
import DashboardEntityList from "@/features/dashboard/shared/DashboardEntityList";
import MovieForm from "./MovieForm";
import { useMovieList } from "@/hooks/useMovieList";
import { getMovieColumns, getMovieFilters } from "./MovieTableConfig";
import type { Movie } from "@/types/movie";

export default function ListMovies() {
   const [isCreating, setIsCreating] = useState(false);
   const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

   const {
      movies,
      isLoading,
      searchParams,
      setSearchParams,
      pagination,
      handleDelete,
   } = useMovieList(isCreating);

   const handleSearchChange = (name: string, value: any) => {
      setSearchParams((prev: any) => ({
         ...prev,
         [name]: value || undefined,
         page: 1,
      }));
   };

   const resetFilters = () => {
      setSearchParams({
         page: 1,
         size: 10,
         keyword: "",
         status: "",
         releaseDateFrom: "",
         releaseDateTo: "",
      });
   };

   const handleSuccess = () => {
      setIsCreating(false);
      setEditingMovie(null);
   };

   // Khởi tạo columns với handlers tương tự bên User
   const columns = useMemo(
      () =>
         getMovieColumns({
            onEdit: (movie) => {
               setEditingMovie(movie);
               setIsCreating(true); // Giả định dùng chung form create để edit
            },
            onDelete: handleDelete,
         }),
      [handleDelete],
   );

   const filters = useMemo(() => getMovieFilters(), []);

   return (
      <DashboardEntityList
         title="Movie"
         entityName="movie"
         isCreating={isCreating}
         onToggleCreating={() => setIsCreating((prev) => !prev)}
         filters={filters}
         searchParams={searchParams}
         onSearchChange={handleSearchChange}
         onResetFilters={resetFilters}
         data={movies}
         columns={columns}
         isLoading={isLoading}
         pagination={{
            ...pagination,
            currentPage: searchParams.page,
            pageSize: searchParams.size,
         }}
         onPageChange={(page) =>
            setSearchParams((prev: any) => ({ ...prev, page }))
         }
         renderCreateForm={() => (
            <MovieForm
               onCancel={() => setIsCreating(false)}
               onSuccess={handleSuccess}
            />
         )}
      />
   );
}
