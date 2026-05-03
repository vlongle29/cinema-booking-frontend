import { useState, useCallback, useEffect, useMemo } from "react";
import { seatTemplateService } from "../services/seatTemplateService";
import toast from "react-hot-toast";

interface SeatTemplate {
   id: string;
   name: string;
   description: string;
   rows: number;
   columns: number;
   totalSeats: number;
   // Add other properties if they exist on your template object
}

interface SeatTemplateSearchParams {
   page: number;
   size: number;
   keyword: string;
}

export const useSeatTemplateList = () => {
   const [allTemplates, setAllTemplates] = useState<SeatTemplate[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchParams, setSearchParams] = useState<SeatTemplateSearchParams>({
      page: 1,
      size: 10,
      keyword: "",
   });

   const fetchAllTemplates = useCallback(async () => {
      setIsLoading(true);
      try {
         const response = await seatTemplateService.getAllTemplates();
         if (response.data) {
            setAllTemplates(response.data);
         }
      } catch (error) {
         toast.error("Không thể tải danh sách template");
         console.error("Failed to fetch seat templates:", error);
      } finally {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchAllTemplates();
   }, [fetchAllTemplates]);

   const filteredAndPaginatedTemplates = useMemo(() => {
      let filtered = allTemplates;
      if (searchParams.keyword) {
         filtered = allTemplates.filter(
            (t) =>
               t.name
                  .toLowerCase()
                  .includes(searchParams.keyword.toLowerCase()) ||
               t.description
                  ?.toLowerCase()
                  .includes(searchParams.keyword.toLowerCase()),
         );
      }

      const totalElements = filtered.length;
      const totalPages = Math.ceil(totalElements / searchParams.size);
      const startIndex = (searchParams.page - 1) * searchParams.size;
      const endIndex = startIndex + searchParams.size;
      const paginated = filtered.slice(startIndex, endIndex);

      return {
         content: paginated,
         totalElements,
         totalPages,
      };
   }, [allTemplates, searchParams]);

   const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa template này?")) {
         try {
            await seatTemplateService.deleteTemplate(id);
            toast.success("Xóa thành công");
            // Re-fetch all templates to update the list
            fetchAllTemplates();
         } catch (error) {
            toast.error("Xóa thất bại");
            console.error("Failed to delete seat template:", error);
         }
      }
   };

   return {
      templates: filteredAndPaginatedTemplates.content,
      isLoading,
      searchParams,
      setSearchParams,
      pagination: {
         totalPages: filteredAndPaginatedTemplates.totalPages,
         totalElements: filteredAndPaginatedTemplates.totalElements,
         currentPage: searchParams.page,
         pageSize: searchParams.size,
      },
      handleDelete,
   };
};
