import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import DashboardEntityList from "../../../components/dashboard/DashboardEntityList";
import { useSeatTemplateList } from "../../../hooks/useSeatTemplateList";
import {
   getSeatTemplateColumns,
   getSeatTemplateFilters,
} from "../../../hooks/SeatTemplateTableConfig";
import TemplateCard from "./TemplateCard";
import CreateSeatTemplate from "./CreateSeatTemplate";
import SeatTemplateEditor from "./SeatTemplateEditor";
import ApplyTemplateToRoom from "./ApplyTemplateToRoom";

const SeatTemplateList = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
   const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

   const {
      templates,
      isLoading,
      searchParams,
      setSearchParams,
      pagination,
      handleDelete,
   } = useSeatTemplateList();

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
      });
   };

   const handleEdit = (template: any) => {
      setSelectedTemplate(template);
      setIsEditModalOpen(true);
   };

   const handleApply = (template: any) => {
      setSelectedTemplate(template);
      setIsApplyModalOpen(true);
   };

   const columns = getSeatTemplateColumns(
      handleEdit,
      handleDelete,
      handleApply,
   );
   const filters = getSeatTemplateFilters();

   return (
      <>
         <DashboardEntityList
            title="Seat Template"
            entityName="seat template"
            isCreating={isModalOpen} // Use isModalOpen for the create form
            onToggleCreating={() => setIsModalOpen((prev) => !prev)}
            filters={filters}
            searchParams={searchParams}
            onSearchChange={handleSearchChange}
            onResetFilters={resetFilters}
            data={templates}
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
               <CreateSeatTemplate
                  onClose={() => setIsModalOpen(false)}
                  onSubmit={() => {
                     setIsModalOpen(false);
                     // Trigger re-fetch of templates after successful creation
                     setSearchParams((prev) => ({ ...prev }));
                  }}
               />
            )}
            renderCustomList={(data) => (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-6">
                  {data.map((template) => (
                     <TemplateCard
                        key={template.id}
                        template={template}
                        onEdit={() => handleEdit(template)}
                        onDelete={handleDelete}
                        onApply={() => handleApply(template)}
                     />
                  ))}
               </div>
            )}
         />

         {/* Edit Template Modal */}
         {isEditModalOpen && selectedTemplate && (
            <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
               onClick={() => setIsEditModalOpen(false)}
            >
               <div
                  className="relative w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
               >
                  <SeatTemplateEditor
                     template={selectedTemplate}
                     onClose={() => setIsEditModalOpen(false)} // Close modal
                     onSubmit={() => {
                        setIsEditModalOpen(false);
                        setSearchParams((prev) => ({ ...prev })); // Trigger re-fetch
                     }}
                  />
               </div>
            </div>
         )}

         {/* Apply Template Modal */}
         {isApplyModalOpen && selectedTemplate && (
            <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
               onClick={() => setIsApplyModalOpen(false)}
            >
               <div
                  className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
               >
                  <ApplyTemplateToRoom
                     templateId={selectedTemplate.id}
                     roomId={selectedTemplate.roomId}
                     onClose={() => {
                        setIsApplyModalOpen(false);
                        setSearchParams((prev) => ({ ...prev })); // Trigger re-fetch
                     }}
                  />
               </div>
            </div>
         )}
      </>
   );
};

export default SeatTemplateList;
