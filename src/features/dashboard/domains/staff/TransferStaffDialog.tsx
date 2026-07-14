import React, { useState } from "react";
import { X, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/types/employee";

interface TransferStaffDialogProps {
   employee: Employee | null;
   branchOptions: { value: string; label: string }[];
   onClose: () => void;
   onConfirm: (userId: string, branchId: string) => void;
}

const TransferStaffDialog: React.FC<TransferStaffDialogProps> = ({
   employee,
   branchOptions,
   onClose,
   onConfirm,
}) => {
   const [branchId, setBranchId] = useState("");
   const [loading, setLoading] = useState(false);

   if (!employee) return null;

   const handleConfirm = async () => {
      if (!branchId) return;
      setLoading(true);
      try {
         await onConfirm(employee.userId, branchId);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
         <div className="bg-[#1a1a1e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
               <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft size={20} className="text-orange-400" />
                  Chuyển chi nhánh
               </h2>
               <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition-colors"
               >
                  <X size={22} />
               </button>
            </div>

            <div className="p-6 space-y-4">
               <p className="text-sm text-gray-400">
                  Chuyển nhân viên{" "}
                  <span className="text-white font-medium">
                     {employee.name}
                  </span>{" "}
                  ({employee.employeeCode}) từ{" "}
                  <span className="text-rose-400">
                     {employee.branchName || "—"}
                  </span>{" "}
                  sang chi nhánh mới:
               </p>

               <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full bg-[#0B0B0F] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500/20 outline-none"
               >
                  <option value="">Chọn chi nhánh đích</option>
                  {branchOptions
                     .filter((b) => b.value !== employee.branchId)
                     .map((opt) => (
                        <option key={opt.value} value={opt.value}>
                           {opt.label}
                        </option>
                     ))}
               </select>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3">
               <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="text-gray-400"
               >
                  Hủy
               </Button>
               <Button
                  onClick={handleConfirm}
                  disabled={!branchId || loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
               >
                  {loading ? "Đang chuyển..." : "Xác nhận chuyển"}
               </Button>
            </div>
         </div>
      </div>
   );
};

export default TransferStaffDialog;
