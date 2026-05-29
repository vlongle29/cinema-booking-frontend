import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message: string;
   type?: "danger" | "warning" | "info";
   loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
   isOpen,
   onClose,
   onConfirm,
   title,
   message,
   type = "danger",
   loading,
}) => {
   if (!isOpen) return null;

   const colors = {
      danger: "bg-red-600 hover:bg-red-700",
      warning: "bg-yellow-500 hover:bg-yellow-600",
      info: "bg-blue-600 hover:bg-blue-700",
   };

   return (
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
         <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
               <div className="flex items-center gap-4 mb-4">
                  <div
                     className={`p-3 rounded-full ${type === "danger" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}
                  >
                     <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{title}</h3>
               </div>
               <p className="text-gray-600 mb-6">{message}</p>
               <div className="flex justify-end gap-3">
                  <button
                     onClick={onClose}
                     disabled={loading}
                     className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                     Hủy
                  </button>
                  <button
                     onClick={onConfirm}
                     disabled={loading}
                     className={`px-4 py-2 text-white rounded-lg transition-colors ${colors[type]}`}
                  >
                     {loading ? "Đang xử lý..." : "Xác nhận"}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ConfirmDialog;
