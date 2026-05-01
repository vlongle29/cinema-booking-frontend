import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { seatTemplateService } from "../../../services/seatTemplateService";
import toast from "react-hot-toast";
import { FiPlus, FiSearch } from "react-icons/fi";
import TemplateCard from "./TemplateCard";
import CreateSeatTemplate from "./CreateSeatTemplate";
import SeatTemplateEditor from "./SeatTemplateEditor";
import ApplyTemplateToRoom from "./ApplyTemplateToRoom";

const SeatTemplateList = () => {
   const [templates, setTemplates] = useState<any[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [isLoading, setIsLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
   const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

   const fetchTemplates = async () => {
      try {
         setIsLoading(true);
         const response = await seatTemplateService.getAllTemplates(); 
         setTemplates(response.data);
      } catch (error) {
         toast.error('Không thể tải danh sách template');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => { fetchTemplates(); }, []);
   
   const handleDelete = async (id: string) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa template này?')) {
         try {
            await seatTemplateService.deleteTemplate(id);
            toast.success('Xóa thành công');
            fetchTemplates();
         } catch (error) {
            toast.error('Xóa thất bại');
         }
      }
   };

   const filteredTemplates = Array.isArray(templates) ? templates.filter((t: any) => 
      t.name?.toLowerCase().includes(searchTerm.toLowerCase())
   ) : [];

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-10">
            <div>
               <h1 className="text-3xl font-semibold text-white">
                  Manage{" "}
                  <span className="underline decoration-[#f84565] text-[#f84565]">
                     Seat Templates
                  </span>
               </h1>
               <p className="text-[#797b7d] mt-2">Thiết kế sơ đồ ghế chuẩn cho các phòng chiếu</p>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="bg-[#f84565] hover:bg-[#f84565]/90 text-white px-5 py-2.5 rounded-[6px] flex items-center gap-2 transition-all font-semibold shadow-[0_0_15px_rgba(248,69,101,0.2)]"
            >
               <FiPlus /> Create New Template
            </button>
         </div>

         <div className="bg-[#1a1a1e] border border-[#393939] rounded-[8px] p-5 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4 text-white font-semibold text-sm">
               <FiSearch className="text-[#f84565]" />
               Search Templates
            </div>
            <div className="relative">
               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#797b7d] w-4 h-4" />
               <input
                  type="text"
                  placeholder="Tìm kiếm template..."
                  className="w-full bg-[#252529] border border-[#393939] rounded-[6px] pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f84565] transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         {isLoading ? (
            <div className="bg-[#1a1a1e] border border-[#393939] rounded-[8px] p-20 flex items-center justify-center">
               <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-[#f84565] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#797b7d] text-sm">Loading templates...</p>
               </div>
            </div>
         ) : filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredTemplates.map((template: any) => (
                  <TemplateCard
                     key={template.id}
                     template={template}
                     onEdit={() => {
                        setSelectedTemplate(template);
                        setIsEditModalOpen(true);
                     }}
                     onDelete={handleDelete}
                     onApply={() => {
                        setSelectedTemplate(template);
                        setIsApplyModalOpen(true);
                     }}
                  />
               ))}
            </div>
         ) : (
            <div className="bg-[#1a1a1e] border border-[#393939] rounded-[8px] p-20 text-center">
               <FiSearch className="w-16 h-16 text-[#f84565] mx-auto mb-6 opacity-20" />
               <h3 className="text-white text-lg font-semibold mb-2">No templates found</h3>
               <p className="text-[#797b7d] text-sm">Try adjusting your search criteria.</p>
            </div>
         )}
      {isModalOpen && (
         <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
         >
            <div 
               className="relative w-full max-w-2xl mx-4"
               onClick={(e) => e.stopPropagation()}
            >
               <CreateSeatTemplate onClose={() => setIsModalOpen(false)} onSubmit={() => {setIsModalOpen(false); fetchTemplates();}}/>
            </div>
         </div>
      )}

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
                  onClose={() => setIsEditModalOpen(false)}
                  onSubmit={() => {setIsEditModalOpen(false); fetchTemplates();}}
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
               className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
               onClick={(e) => e.stopPropagation()}
            >
               <ApplyTemplateToRoom
                  templateId={selectedTemplate.id} 
                  roomId={selectedTemplate.roomId}
                  onClose={() => setIsApplyModalOpen(false)}
               />
            </div>
         </div>
      )}
      </div>
   );
};

export default SeatTemplateList;