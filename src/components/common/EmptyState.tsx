import React from "react";
import { AlertCircle } from "lucide-react";

const EmptyState: React.FC<{ title: string; description: string }> = ({
   title,
   description,
}) => (
   <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="w-12 h-12 text-[#f84565] mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#797b7d] text-sm max-w-sm">{description}</p>
   </div>
);

export default EmptyState;