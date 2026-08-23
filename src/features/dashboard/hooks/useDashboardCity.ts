import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { dashboardCityService } from "@/features/dashboard/services/dashboard.city.service";
import type { City, CitySearchDTO } from "@/types/city";

export function useDashboardCity() {
   const [isCreating, setIsCreating] = useState(false);
   const [editingCity, setEditingCity] = useState<City | null>(null);
   const [cities, setCities] = useState<City[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   const [searchParams, setSearchParams] = useState<CitySearchDTO>({
      page: 1,
      size: 10,
   });
   const [totalElements, setTotalElements] = useState(0);
   const [totalPages, setTotalPages] = useState(0);

   const debouncedSearchParams = useDebounce(searchParams, 500);

   const fetchCities = useCallback(async () => {
      setIsLoading(true);
      try {
         const response = await dashboardCityService.search(debouncedSearchParams);
         setCities(response.data?.content ?? []);
         setTotalElements(response.data?.totalElements ?? 0);
         setTotalPages(response.data?.totalPages ?? 0);
      } catch (error) {
         console.error("Lỗi khi tải danh sách thành phố:", error);
         setCities([]);
      } finally {
         setIsLoading(false);
      }
   }, [debouncedSearchParams]);


   useEffect(() => {
      fetchCities();
   }, [fetchCities]);

   const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa thành phố này?")) {
         await dashboardCityService.delete(id);
         fetchCities();
      }
   };

   const handleSearchChange = (name: keyof CitySearchDTO, value: any) => {
      setSearchParams((prev) => ({ ...prev, [name]: value, page: 1 }));
   };

   const handleResetFilters = () => {
      setSearchParams({ page: 1, size: 10 });
   };

   const handlePageChange = (page: number) => {
      setSearchParams((prev) => ({ ...prev, page }));
   };

   const toggleCreating = () => {
      setIsCreating((prev) => {
         const willClose = prev;
         if (willClose) setEditingCity(null);
         return !prev;
      });
   };

   const startEditing = (city: City) => {
      setEditingCity(city);
      setIsCreating(true);
   };

   const handleFormSuccess = () => {
      setIsCreating(false);
      fetchCities();
   };

   return {
      state: {
         cities,
         isLoading,
         searchParams,
         totalElements,
         totalPages,
         isCreating,
         editingCity,
      },
      actions: {
         handleDelete,
         handleSearchChange,
         handleResetFilters,
         handlePageChange,
         toggleCreating,
         startEditing,
         handleFormSuccess,
         setIsCreating,
      },
   };
}
