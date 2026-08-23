import { useCallback, useState, useMemo, useEffect } from "react";
import SeatTypeSelector from "./SeatTypeSelector";
import SeatGrid from "./SeatGrid";
import { useNavigate, useParams } from "react-router-dom";
import { seatTemplateService } from "../../../../services/seatTemplateService";
import type { Seat } from "../../../../types/booking";
import toast from "react-hot-toast";
import { generateSeats, countSeatsByType } from "../../../../utils/seatUtils";
import { Loader2, RotateCcw, Save, X } from "lucide-react";

interface SeatTemplateEditorProps {
   template?: any;
   onClose?: () => void;
   onSubmit?: () => void;
}

const SeatTemplateEditor: React.FC<SeatTemplateEditorProps> = ({
   template: propsTemplate,
   onClose,
   onSubmit,
}) => {
   const { id } = useParams<{ id: string }>(); // Get ID from URL to fetch corresponding template
   const templateId = propsTemplate?.id || id;
   const navigate = useNavigate();

   // Manage state data fetched from API
   const [template, setTemplate] = useState<any>(null);
   const [seatTypes, setSeatTypes] = useState<any[]>([]);

   // Manage editor state
   const [seatGrid, setSeatGrid] = useState<Seat[]>([]);
   const [selectedSeatTypeId, setSelectedSeatTypeId] =
      useState<string>("AISLE");

   // UI State
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [isSaving, setIsSaving] = useState<boolean>(false);

   // Fetch data components mounted
   useEffect(() => {
      const fetchInitialData = async () => {
         try {
            setIsLoading(true);
            const [templateData, typesData] = await Promise.all([
               seatTemplateService.getTemplateById(templateId as string),
               seatTemplateService.getSeatTypes(),
            ]);

            const template = templateData.data;
            const types = typesData.data;

            setTemplate(template);
            setSeatTypes(types);

            // Mặc định chọn loại ghế đầu tiên (thường là Standard)
            if (types.length > 0) {
               setSelectedSeatTypeId(types[0].id);
            }

            if (template.seats && template.seats.length > 0) {
               setSeatGrid(template.seats);
            } else {
               const generatedGrid = generateSeats(
                  template.rows,
                  template.columns,
                  types[0].id,
               );
               setSeatGrid(generatedGrid);
            }
         } catch (error) {
            toast.error("Không thể tải thông tin Template. Vui lòng thử lại!");
            console.error("Fetch Editor Data Error:", error);
         } finally {
            setIsLoading(false);
         }
      };

      if (templateId) fetchInitialData();
   }, [templateId]);

   // 2. Logic for processing seat click (Coloring the chair)
   // Use useCallback + Functional Update to optimization performance React.memo
   const handleSeatClick = useCallback(
      (index: number) => {
         setSeatGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            const seat = { ...newGrid[index] };

            if (selectedSeatTypeId === "AISLE") {
               seat.isAisle = true;
            } else {
               seat.isAisle = false;
               seat.seatTypeId = selectedSeatTypeId;
            }

            if (
               newGrid[index].isAisle === seat.isAisle &&
               newGrid[index].seatTypeId === seat.seatTypeId
            ) {
               return prevGrid;
            }

            newGrid[index] = seat;
            return newGrid;
         });
      },
      [selectedSeatTypeId],
   );

   // 3. Logic for processing right click (On/Off Aisle)
   const handleSeatRightClick = useCallback((index: number) => {
      setSeatGrid((prevGrid) => {
         const newGrid = [...prevGrid];
         newGrid[index] = {
            ...newGrid[index],
            isAisle: !newGrid[index].isAisle,
         };
         return newGrid;
      });
   }, []);

   // 4. Tính toán tổng kết (Dùng useMemo để chỉ tính lại khi grid thay đổi)
   const summary = useMemo(() => countSeatsByType(seatGrid), [seatGrid]);

   // 5. Lưu xuống DB
   const handleSave = async () => {
      try {
         setIsSaving(true);
         const payload = seatGrid.map((seat) => ({
            seatNumber: seat.seatNumber,
            seatTypeId: seat.seatTypeId,
            rowIndex: seat.rowIndex,
            colIndex: seat.colIndex,
            isAisle: seat.isAisle,
         }));
         await seatTemplateService.addSeatsToTemplate(
            templateId as string,
            payload,
         );
         toast.success("Đã lưu sơ đồ ghế thành công!");
         if (onSubmit) {
            onSubmit();
         } else {
            navigate("/dashboard/seat-template"); // Quay lại trang danh sách sau khi lưu
         }
      } catch (error) {
         toast.error("Lưu thất bại. Vui lòng thử lại!");
      } finally {
         setIsSaving(false);
      }
   };

   // Nút Reset: Trả sơ đồ về trạng thái Generate ban đầu
   const handleReset = () => {
      if (
         window.confirm(
            "Bạn có chắc muốn làm lại từ đầu? Mọi chỉnh sửa sẽ bị mất.",
         )
      ) {
         const defaultTypeId = seatTypes.length > 0 ? seatTypes[0].id : "";
         const generatedGrid = generateSeats(
            template.rows,
            template.columns,
            defaultTypeId,
         );
         setSeatGrid(generatedGrid);
      }
   };

   if (isLoading) {
      return (
         <div className="flex flex-col justify-center items-center h-64 text-[#797b7d] bg-[#1a1a1e] rounded-xl border border-[#393939] gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#f84565]" />
            <span className="text-xs font-medium">Đang tải sơ đồ rạp...</span>
         </div>
      );
   }

   if (!template) {
      return (
         <div className="text-center text-rose-400 bg-[#1a1a1e] p-8 rounded-xl border border-[#393939] text-sm font-medium">
            Không tìm thấy Template!
         </div>
      );
   }

   const totalBookableSeats = seatGrid.filter((s) => !s.isAisle).length;

   return (
      <div className="bg-[#1a1a1e] p-5 sm:p-6 rounded-xl border border-[#393939] shadow-2xl text-white">
         {/* Header */}
         <div className="mb-4 flex items-start justify-between gap-4 border-b border-[#393939]/70 pb-3.5">
            <div>
               <h1 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  Chỉnh sửa: <span className="text-[#f84565]">{template.name}</span>
               </h1>
               <p className="text-[#797b7d] text-sm mt-1">
                  Kích thước: {template.rows} hàng × {template.columns} cột • Click chuột trái để tô ghế, chuột phải để bật/tắt lối đi.
               </p>
            </div>
            {onClose && (
               <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-md text-[#797b7d] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Đóng"
               >
                  <X className="w-5 h-5" />
               </button>
            )}
         </div>

         {/* Toolbar Chọn loại ghế */}
         <SeatTypeSelector
            seatTypes={seatTypes}
            selectedSeatTypeId={selectedSeatTypeId}
            onSelect={setSelectedSeatTypeId}
         />

         {/* Grid display seats */}
         <div className="mb-4">
            <SeatGrid
               seats={seatGrid}
               columns={template.columns}
               seatTypes={seatTypes}
               onSeatClick={handleSeatClick}
               onSeatRightClick={handleSeatRightClick}
            />
         </div>

         {/* Footer: Summary & Buttons */}
         <div className="bg-[#252529] border border-[#393939] rounded-lg p-3.5 sm:px-5 sm:py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Seat count summary */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
               <div className="flex items-center gap-2 pr-4 border-r border-[#393939]">
                  <span className="text-[#797b7d] uppercase font-semibold text-xs tracking-wide">
                     Tổng ghế bán:
                  </span>
                  <span className="text-base font-bold text-white">
                     {totalBookableSeats}
                  </span>
               </div>

               {seatTypes.map((type) => (
                  <div key={type.id} className="flex items-center gap-1.5">
                     <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: type.color }}
                     />
                     <span className="text-[#d1d5dc]">{type.name}:</span>
                     <span className="font-bold text-white">
                        {summary[type.id] || 0}
                     </span>
                  </div>
               ))}

               <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#797b7d] inline-block" />
                  <span className="text-[#797b7d]">Lối đi:</span>
                  <span className="font-bold text-[#a1a1aa]">
                     {summary["AISLE"] || 0}
                  </span>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
               <button
                  type="button"
                  onClick={() =>
                     onClose ? onClose() : navigate("/dashboard/seat-template")
                  }
                  className="px-4 py-2 rounded-md border border-[#393939] text-[#d1d5dc] hover:bg-[#393939]/50 font-medium text-sm transition-colors cursor-pointer"
               >
                  Quay lại
               </button>
               <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-md border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-medium text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
               >
                  <RotateCcw className="w-4 h-4" />
                  Làm lại
               </button>
               <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-md bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(248,69,101,0.25)]"
               >
                  {isSaving ? (
                     <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu...</span>
                     </>
                  ) : (
                     <>
                        <Save className="w-4 h-4" />
                        <span>Lưu sơ đồ</span>
                     </>
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};

export default SeatTemplateEditor;
