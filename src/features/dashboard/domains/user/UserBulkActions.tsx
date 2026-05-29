import React from "react";
import { Lock, Unlock, Trash2, ChevronDown } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserBulkActionsProps {
   selectedCount: number;
   onLock: () => void;
   onUnlock: () => void;
   onDelete: () => void;
}

export const UserBulkActions: React.FC<UserBulkActionsProps> = ({
   selectedCount,
   onLock,
   onUnlock,
   onDelete,
}) => {
   if (selectedCount === 0) return null;

   return (
      <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between mb-4">
         <span className="text-blue-400 font-medium text-sm">
            Đã chọn <span className="font-bold">{selectedCount}</span> người
            dùng
         </span>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="outline"
                  className="gap-2 bg-transparent border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
               >
                  Chọn hành động...
                  <ChevronDown size={16} />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               align="end"
               className="w-56 bg-[#1a1a1e] border-white/10 text-gray-300"
            >
               <DropdownMenuItem
                  onClick={onLock}
                  className="cursor-pointer hover:bg-white/5"
               >
                  <Lock size={14} className="mr-2 text-orange-400" />
                  <span>Khóa các tài khoản chọn</span>
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={onUnlock}
                  className="cursor-pointer hover:bg-white/5"
               >
                  <Unlock size={14} className="mr-2 text-emerald-400" />
                  <span>Mở khóa các tài khoản chọn</span>
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={onDelete}
                  className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
               >
                  <Trash2 size={14} className="mr-2" />
                  <span>Xóa những người dùng đã chọn</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};
