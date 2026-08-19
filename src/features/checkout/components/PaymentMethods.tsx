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
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6 text-amber-500" />
         </div>
         <div className="space-y-3">
            {paymentMethodsData.map((method) => (
               <label
                  key={method.id}
                  className={cn(
                     "flex items-center p-4 border rounded-lg cursor-pointer transition-all",
                     selectedMethod === method.id
                        ? "border-amber-500 bg-amber-500/10 border-2"
                        : "border-slate-200 hover:border-amber-300 hover:bg-amber-50",
                  )}
               >
                  <input
                     type="radio"
                     name="paymentMethod"
                     value={method.id}
                     checked={selectedMethod === method.id}
                     onChange={() => onSelect(method.id)}
                     className="h-4 w-4 text-amber-600 border-slate-300 focus:ring-amber-500"
                  />
                  <div className="ml-4 flex items-center gap-3 flex-grow">
                     <img
                        src={method.iconUrl}
                        alt={method.name}
                        className="w-8 h-8 object-contain"
                     />
                     <span className="font-medium text-slate-700">
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
