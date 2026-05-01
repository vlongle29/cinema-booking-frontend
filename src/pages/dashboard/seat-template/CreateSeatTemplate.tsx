import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { seatTemplateService } from '../../../services/seatTemplateService';

interface CreateSeatTemplateProps {
  onClose?: () => void;
  onSubmit?: () => void;
}

const CreateSeatTemplate: React.FC<CreateSeatTemplateProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rows: 10,
    columns: 10
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.rows > 20 || formData.columns > 20) {
      return toast.error('Kích thước tối đa là 20x20');
    }
    try {
      await seatTemplateService.createTemplate(formData);
      toast.success('Tạo thành công! Hãy bắt đầu xếp ghế.');
      onSubmit?.();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo template');
    }
  };

  return (
    <div className="w-full bg-[#1a1a1e] p-8 rounded-xl border border-[#393939] shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-white border-b border-[#393939] pb-4">Create New Template</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#797b7d] mb-1.5">Template Name</label>
          <input 
            required
            className="w-full p-2.5 bg-[#252529] border border-[#393939] text-white rounded-lg outline-none focus:ring-1 focus:ring-[#f84565] focus:border-[#f84565]"
            placeholder="VD: Standard IMAX 10x12"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#797b7d] mb-1.5">Description</label>
          <textarea 
            className="w-full p-2.5 bg-[#252529] border border-[#393939] text-white rounded-lg outline-none focus:ring-1 focus:ring-[#f84565] focus:border-[#f84565]"
            rows={3}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#797b7d] mb-1.5">Rows (Max 20)</label>
            <input 
              type="number" min="1" max="20"
              className="w-full p-2.5 bg-[#252529] border border-[#393939] text-white rounded-lg outline-none focus:ring-1 focus:ring-[#f84565] focus:border-[#f84565]"
              value={formData.rows}
              onChange={e => setFormData({...formData, rows: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#797b7d] mb-1.5">Columns (Max 20)</label>
            <input 
              type="number" min="1" max="20"
              className="w-full p-2.5 bg-[#252529] border border-[#393939] text-white rounded-lg outline-none focus:ring-1 focus:ring-[#f84565] focus:border-[#f84565]"
              value={formData.columns}
              onChange={e => setFormData({...formData, columns: parseInt(e.target.value)})}
            />
          </div>
        </div>
        <div className="pt-6 flex gap-4">
          <button type="button" onClick={() => onClose?.()} className="flex-1 py-3 border border-[#393939] text-white rounded-lg hover:bg-[#252529] transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-3 bg-[#f84565] text-white rounded-lg hover:bg-[#f84565]/90 transition-colors font-semibold shadow-[0_0_15px_rgba(248,69,101,0.2)]">
            Create Template →
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSeatTemplate;