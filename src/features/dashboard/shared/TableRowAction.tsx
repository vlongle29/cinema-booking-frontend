import React from "react";
import {
   NativeSelect,
   NativeSelectOption,
} from "@/components/ui/native-select";
import { EllipsisVertical } from "lucide-react";

interface Option {
   label: string;
   value: string;
}

interface TableRowSelectProps {
   options: Option[];
   placeholder?: string;
   value?: string;
   onChange: (value: string) => void;
}

export const TableRowSelect: React.FC<TableRowSelectProps> = ({
   options,
   placeholder = "Chọn thao tác...",
   value = "",
   onChange,
}) => {
   return (
      <NativeSelect>
         <NativeSelectOption value="">Select status</NativeSelectOption>
         <NativeSelectOption value="todo">
            <EllipsisVertical />
         </NativeSelectOption>
         <NativeSelectOption value="in-progress">
            In Progress
         </NativeSelectOption>
         <NativeSelectOption value="done">Done</NativeSelectOption>
         <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
      </NativeSelect>
   );
};
