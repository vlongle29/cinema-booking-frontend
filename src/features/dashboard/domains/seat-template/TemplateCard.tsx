import { FiEdit2, FiTrash2, FiCheckSquare } from 'react-icons/fi';

const TemplateCard = ({ template, onEdit, onDelete, onApply }: { template: any, onEdit: () => void, onDelete: (id: string) => void, onApply: () => void }) => {
  return (
    <div className="bg-[rgba(248,69,101,0.05)] p-6 rounded-xl border border-[rgba(248,69,101,0.15)] hover:border-[#f84565] transition-all duration-300 flex flex-col h-full group relative overflow-hidden backdrop-blur-sm">
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#f84565] opacity-[0.03] rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
      
      <div className="flex-1 relative z-10">
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#f84565] transition-colors leading-tight">
          {template.name}
        </h3>
        <p className="text-sm text-[#797b7d] mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
          {template.description || 'Không có mô tả'}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-black/30 p-4 rounded-lg border border-[#393939]">
          <div>
            <span className="text-[#797b7d] block text-[10px] uppercase font-bold tracking-widest mb-1.5">Layout</span>
            <span className="text-[#d1d5dc] font-medium">{template.rows} R × {template.columns} C</span>
          </div>
          <div>
            <span className="text-[#797b7d] block text-[10px] uppercase font-bold tracking-widest mb-1.5">Capacity</span>
            <span className="text-[#d1d5dc] font-medium">{template.totalSeats} Seats</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 pt-5 border-t border-[#393939] relative z-10">
        <button
          onClick={onApply}
          className="flex-1 bg-[#f84565] hover:bg-[#f84565]/90 text-white px-4 py-2.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(248,69,101,0.1)] active:scale-95"
        >
          <FiCheckSquare size={14} />
          Apply
        </button>
        <button
          onClick={onEdit}
          className="p-2.5 text-[#797b7d] hover:text-[#f84565] hover:bg-[#f84565]/10 rounded-[6px] transition-all border border-[#393939] bg-[#1a1a1e]"
          title="Chỉnh sửa ghế"
        >
          <FiEdit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(template.id)}
          className="p-2.5 text-[#797b7d] hover:text-red-500 hover:bg-red-500/10 rounded-[6px] transition-all border border-[#393939] bg-[#1a1a1e]"
          title="Xóa template"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;