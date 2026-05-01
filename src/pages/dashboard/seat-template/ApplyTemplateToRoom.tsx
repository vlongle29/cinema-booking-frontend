import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { seatTemplateService } from '../../../services/seatTemplateService';
import SeatGrid from './SeatGrid';
import type { SeatType } from '../../../types/booking';
import type { Room } from '../../../types/room';

interface ApplyTemplateProps {
  templateId?: string;
  roomId?: string;
  onClose?: () => void;
}

const ApplyTemplateToRoom: React.FC<ApplyTemplateProps> = ({ templateId: propsTemplateId, roomId: propsRoomId, onClose }) => {
  const { id } = useParams<{ id: string }>();
  const [templates, setTemplates] = useState<any[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(propsRoomId ?? '');
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const [tResponse, rResponse, stResponse] = await Promise.all([
        seatTemplateService.getAllTemplates(),
        seatTemplateService.getRooms(),
        seatTemplateService.getSeatTypes()
      ]);
      setTemplates(tResponse.data);
      setRooms(rResponse.data);
      setSeatTypes(stResponse.data);
      
      // Auto select if id from router or props exists
      const targetId = id || propsTemplateId;
      if (targetId) {
         setSelectedTemplateId(targetId);
         const templateRes = await seatTemplateService.getTemplateById(targetId);
         setPreviewTemplate(templateRes.data);
      }

      // Auto select room if passed as prop
      if (propsRoomId) {
        setSelectedRoomId(propsRoomId);
      }
    };
    loadData();
  }, [id]);

  const handleTemplateChange = async (id: string) => {
    setSelectedTemplateId(id);
    if (id) {
      const data = await seatTemplateService.getTemplateById(id);
      setPreviewTemplate(data.data);
    } else {
      setPreviewTemplate(null);
    }
  };

  const handleApply = async () => {
    if (!selectedTemplateId || !selectedRoomId) return toast.error('Vui lòng chọn đầy đủ thông tin');
    
    if (window.confirm('Sau khi áp dụng, sơ đồ cũ của phòng này (nếu có) sẽ bị xóa. Tiếp tục?')) {
      try {
        await seatTemplateService.applyTemplateToRoom({templateId: selectedTemplateId, roomId: selectedRoomId});
        toast.success('Áp dụng template vào phòng thành công!');
        onClose?.();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      }
    }
  };

  return (
    <div className="w-full bg-[#1a1a1e] p-8 rounded-xl border border-[#393939] shadow-2xl space-y-6">
      <div className="flex justify-between items-center border-b border-[#393939] pb-4">
        <h2 className="text-2xl font-bold text-white">Apply Template To Room</h2>
        {onClose && (
           <button onClick={onClose} className="text-[#797b7d] hover:text-white transition-colors">
              ✕
           </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* <div>
          <label className="block text-sm font-bold text-[#797b7d] mb-2">1. Choose Template</label>
          <select 
            className="w-full p-2.5 bg-[#252529] border border-[#393939] text-white rounded-lg outline-none focus:ring-1 focus:ring-[#f84565] focus:border-[#f84565]"
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            <option value="">-- Choose template --</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.totalSeats} seats)</option>)}
          </select>
        </div> */}
        <div>
          <label className="block text-sm font-bold text-[#797b7d] mb-2">1. Choose Room</label>
          <select 
            className="w-full p-2.5 bg-[#252529] border border-[#393939] text-white rounded-lg outline-none focus:ring-1 focus:ring-[#f84565] focus:border-[#f84565]"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
          >
            <option value="">-- Choose room --</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      {previewTemplate && (
        <div className="bg-[#252529] p-6 rounded-xl border border-[#393939]">
          <h3 className="text-lg font-bold mb-4 text-center text-white">Preview: {previewTemplate.name}</h3>
          <SeatGrid 
            seats={previewTemplate.seats} 
            columns={previewTemplate.columns} 
            seatTypes={seatTypes} 
            readOnly={true} 
          />
          <div className="mt-8 flex justify-center gap-4">
            {onClose && (
               <button 
                 onClick={onClose}
                 className="px-8 py-3 rounded-xl font-bold text-white border border-[#393939] hover:bg-[#1a1a1e] transition-all"
               >
                 Cancel
               </button>
            )}
            <button 
              onClick={handleApply}
              className="bg-[#f84565] text-white px-10 py-3 rounded-xl font-bold text-lg hover:bg-[#f84565]/90 transition-all shadow-[0_0_15px_rgba(248,69,101,0.2)] active:scale-95"
            >
              Confirm Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyTemplateToRoom;