import React from "react";

const SkeletonLoader: React.FC<{ count?: number; type?: string }> = ({
   count = 3,
   type = "chip",
}) => {
   if (type === "chip") {
      return (
         <div className="flex gap-2 flex-wrap">
            {Array(count)
               .fill(0)
               .map((_, i) => (
                  <div
                     key={i}
                     className="h-8 w-20 bg-[#252529] rounded-full animate-pulse"
                  />
               ))}
         </div>
      );
   }

   if (type === "theater") {
      return (
         <div className="space-y-3">
            {Array(count)
               .fill(0)
               .map((_, i) => (
                  <div
                     key={i}
                     className="bg-[#1a1a1e] rounded-lg p-3.5 animate-pulse"
                  >
                     <div className="h-4 bg-[#252529] rounded w-1/3 mb-2" />
                     <div className="h-3 bg-[#252529] rounded w-1/4 mb-3" />
                     <div className="flex gap-1.5">
                        {Array(5)
                           .fill(0)
                           .map((_, j) => (
                              <div
                                 key={j}
                                 className="h-7 w-14 bg-[#252529] rounded"
                              />
                           ))}
                     </div>
                  </div>
               ))}
         </div>
      );
   }

   return null;
};

export default SkeletonLoader;

