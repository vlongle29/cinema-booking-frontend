// src/features/checkout/components/PaymentMethods.tsx
import React from "react";
import { Wallet } from "lucide-react";
import { cn } from "@/utils/utils";
import { paymentMethodsData } from "../data/paymentMethods";

interface PaymentMethodsProps {
   selectedMethod: string;
   onSelect: (id: string) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
   selectedMethod,
   onSelect,
}) => {
   return (
      <div className="bg-[#1a1a1d] p-6 rounded-xl border border-white/10 shadow-lg">
         <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6 text-rose-500" />
         </div>
         <div className="space-y-3">
            {paymentMethodsData.map((method) => (
               <label
                  key={method.id}
                  className={cn(
                     "flex items-center p-4 border rounded-lg cursor-pointer transition-all",
                     selectedMethod === method.id
                        ? "border-rose-500 bg-rose-500/10 border-2"
                        : "border-white/10 hover:border-white/20 hover:bg-white/5",
                  )}
               >
                  <input
                     type="radio"
                     name="paymentMethod"
                     value={method.id}
                     checked={selectedMethod === method.id}
                     onChange={() => onSelect(method.id)}
                     className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                  />
                  <div className="ml-4 flex items-center gap-3 flex-grow">
                     <img
                        src={method.iconUrl}
                        alt={method.name}
                        className="w-8 h-8 object-contain"
                     />
                     <span className="font-medium text-white">
                        {method.name}
                     </span>
                  </div>
                  {method.logo && (
                     <img
                        src={method.logo}
                        alt={`${method.name} logo`}
                        className="h-6 object-contain"
                     />
                  )}
               </label>
            ))}
         </div>
      </div>
   );
};
