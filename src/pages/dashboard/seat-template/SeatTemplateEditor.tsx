import { useCallback, useState, useMemo } from "react";
import SeatTypeSelector from "./SeatTypeSelector";
import SeatGrid from "./SeatGrid";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { seatTemplateService } from "../../../services/seatTemplateService";
import type { Seat } from "../../../types/booking";
import toast from "react-hot-toast";
import { generateSeats, countSeatsByType } from "../../../lib/seatUtils";

interface SeatTemplateEditorProps {
   template?: any;
   onClose?: () => void;
   onSubmit?: () => void;
}

const SeatTemplateEditor: React.FC<SeatTemplateEditorProps> = ({ template: propsTemplate, onClose, onSubmit }) => {
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

   console.log("seatGrid", seatGrid);

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
             isAisle: seat.isAisle,
         }));
         await seatTemplateService.addSeatsToTemplate(templateId as string, payload);
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
         <div className="flex justify-center items-center h-64 text-gray-500">
            Đang tải sơ đồ rạp...
         </div>
      );
   }

   if (!template) {
      return (
         <div className="text-center text-red-500 mt-10">
            Không tìm thấy Template!
         </div>
      );
   }

   return (
      <div>
         {/* Header */}
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
               Chỉnh sửa: <span className="text-blue-600">{template.name}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
               Kích thước: {template.rows} hàng × {template.columns} cột. Kéo
               thả / click để chọn loại ghế. Click chuột phải để tạo lối đi.
            </p>
         </div>

         {/* Toolbar Chọn loại ghế */}
         <SeatTypeSelector
            seatTypes={seatTypes}
            selectedSeatTypeId={selectedSeatTypeId}
            onSelect={setSelectedSeatTypeId}
         />

         {/* Grid display seats */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            <SeatGrid
               seats={seatGrid}
               columns={template.columns}
               seatTypes={seatTypes}
               onSeatClick={handleSeatClick}
               onSeatRightClick={handleSeatRightClick}
            />
         </div>

         {/* Phần Tổng kết (Summary) & Buttons */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Bảng đếm ghế */}
            <div className="flex flex-wrap gap-4">
               <div className="pr-4 border-r border-gray-200">
                  <span className="text-xs text-gray-500 uppercase font-bold">
                     Tổng số ghế bán
                  </span>
                  <div className="text-xl font-bold text-gray-800">
                     {seatGrid.filter((s) => !s.isAisle).length}
                  </div>
               </div>

               {seatTypes.map((type) => (
                  <div key={type.id}>
                     <span className="text-xs text-gray-500 uppercase font-bold">
                        {type.name}
                     </span>
                     <div
                        className="text-lg font-bold text-gray-800"
                        style={{ color: type.color }}
                     >
                        {summary[type.id] || 0}{" "}
                        <span className="text-sm font-normal text-gray-500">
                           ghế
                        </span>
                     </div>
                  </div>
               ))}

               <div>
                  <span className="text-xs text-gray-500 uppercase font-bold">
                     Lối đi
                  </span>
                  <div className="text-lg font-bold text-gray-400">
                     {summary["AISLE"] || 0}{" "}
                     <span className="text-sm font-normal">ô</span>
                  </div>
               </div>
            </div>

            {/* Nút Action */}
            <div className="flex gap-3 w-full md:w-auto">
               <button
                  onClick={() => onClose ? onClose() : navigate("/admin/seat-template")}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
               >
                  Quay lại
               </button>
               <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
               >
                  Reset
               </button>
               <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
               >
                  {isSaving ? "Đang lưu..." : "Lưu Template"}
               </button>
            </div>

            {/* Footer */}
         </div>
      </div>
   );
};

export default SeatTemplateEditor;