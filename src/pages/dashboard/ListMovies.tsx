import { useState } from "react";
import DashboardEntityList from "../../components/dashboard/DashboardEntityList";
import MovieForm from "../../components/dashboard/movies/MovieForm";
import { useMovieList } from "../../hooks/useMovieList";
import {
   getMovieColumns,
   getMovieFilters,
} from "../../components/dashboard/movies/MovieTableConfig";

export default function ListMovies() {
   const [isCreating, setIsCreating] = useState(false);

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
   };

   const columns = getMovieColumns(handleDelete);
   const filters = getMovieFilters();

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
