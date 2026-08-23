import React, { useState } from "react";
import { HiArrowsRightLeft, HiOutlineBuildingOffice2, HiOutlineUserMinus, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
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

   const hasCurrentBranch = Boolean(employee.branchId || (employee.branchName && employee.branchName !== "—"));
   const isUnassigning = branchId === "UNASSIGN";

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
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-[#16161a]">
               <h2 className="text-base font-semibold text-white flex items-center gap-2.5">
                  <HiArrowsRightLeft className="text-orange-400 text-lg" />
                  Điều chuyển / Gỡ chi nhánh
               </h2>
               <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
               >
                  <IoClose className="text-xl" />
               </button>
            </div>

            <div className="p-6 space-y-4">
               <div className="p-3.5 rounded-xl bg-[#202025] border border-white/5 text-sm space-y-1.5">
                  <div className="text-gray-400">
                     Nhân sự: <span className="text-white font-medium">{employee.name}</span>{" "}
                     <span className="text-zinc-500 text-xs font-mono">({employee.employeeCode})</span>
                  </div>
                  <div className="text-gray-400">
                     Chi nhánh hiện tại:{" "}
                     <span className="text-rose-400 font-medium">
                        {employee.branchName || "Chưa phân bổ chi nhánh"}
                     </span>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">
                     Chọn thao tác hoặc chi nhánh đích
                  </label>
                  <select
                     value={branchId}
                     onChange={(e) => setBranchId(e.target.value)}
                     className="w-full bg-[#0B0B0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:ring-2 focus:ring-rose-500/20 outline-none cursor-pointer text-sm"
                  >
                     <option value="">-- Chọn chi nhánh đích hoặc gỡ chi nhánh --</option>
                     {hasCurrentBranch && (
                        <option value="UNASSIGN" className="text-rose-400 font-medium bg-[#221719]">
                           Bỏ gán chi nhánh (Gỡ khỏi {employee.branchName || "chi nhánh"})
                        </option>
                     )}
                     {branchOptions
                        .filter((b) => b.value !== employee.branchId)
                        .map((opt) => (
                           <option key={opt.value} value={opt.value}>
                              Chuyển đến: {opt.label}
                           </option>
                        ))}
                  </select>
               </div>

               {isUnassigning && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs leading-relaxed">
                     <HiOutlineExclamationTriangle className="text-rose-400 text-base flex-shrink-0 mt-0.5" />
                     <span>
                        Nhân sự sẽ được gỡ khỏi chi nhánh <strong>{employee.branchName || "hiện tại"}</strong> và chuyển về trạng thái tự do (chưa gán chi nhánh).
                     </span>
                  </div>
               )}
            </div>

            <div className="px-6 py-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
               <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
               >
                  Hủy
               </Button>
               <Button
                  onClick={handleConfirm}
                  disabled={!branchId || loading}
                  className={`text-white cursor-pointer disabled:opacity-50 transition-colors ${
                     isUnassigning
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-orange-500 hover:bg-orange-600"
                  }`}
               >
                  {loading
                     ? "Đang xử lý..."
                     : isUnassigning
                       ? "Xác nhận gỡ chi nhánh"
                       : "Xác nhận chuyển"}
               </Button>
            </div>
         </div>
      </div>
   );
};

export default TransferStaffDialog;
