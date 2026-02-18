import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { cn } from "../lib/utils";
import BookingHeader, { BookingInfo } from "./BookingHeader";

interface Product {
   id: number;
   name: string;
   comboName?: string;
   bonus?: string;
   items?: string[];
   description?: string;
   note?: string;
   price: number;
}

const PRODUCTS: Product[] = [
   {
      id: 1,
      name: "Bắp ngọt 44oz + Coke 32oz",
      comboName: "Bình Xuân Bính Ngọ 2026",
      bonus: "Tặng 01 móc khóa Paconnie cưỡi ngựa",
      price: 302000,
   },
   {
      id: 2,
      name: "Nhà Ba Tôi Một Set",
      items: [
         "01 Ly NBTMP",
         "01 Hộp bắp NBTMP",
         "01 Coca-cola 32oz",
         "01 Bắp ngọt 44oz",
      ],
      description: "Hộp bắp và ly thiết kế hình ngôi nhà, nhựa PP/PVC an toàn.",
      price: 507000,
   },
   {
      id: 3,
      name: "Premium CGV Combo",
      items: ["1 Bắp Ngọt Lớn", "2 Nước Siêu Lớn", "1 Snack"],
      price: 146000,
   },
   {
      id: 4,
      name: "Nhà Ba Tôi Một Cup",
      items: ["01 Ly NBTMP", "01 Coca-cola 32oz", "01 Bắp ngọt 44oz"],
      price: 291000,
   },
   {
      id: 5,
      name: "Topokki Fried Combo",
      items: ["1 phần bánh gạo chiên phô mai", "1 nước lớn"],
      price: 74000,
   },
   {
      id: 6,
      name: "Nhà Ba Tôi Một Bucket",
      items: ["01 Hộp bắp NBTMP", "01 Coca-cola 32oz", "01 Bắp ngọt 44oz"],
      price: 237000,
   },
   {
      id: 7,
      name: "Tết Special Combo",
      items: ["01 Ly nhân vật bất kỳ", "01 Coca-cola 32oz", "01 Bắp ngọt 44oz"],
      note: "Mẫu ly nhân vật phụ thuộc vào số lượng tại rạp",
      price: 280000,
   },
   {
      id: 8,
      name: "Premium My Combo",
      items: ["1 Bắp Ngọt Lớn", "1 Nước Siêu Lớn", "1 Snack"],
      price: 125000,
   },
   {
      id: 9,
      name: "CGV Combo",
      items: ["1 Bắp Ngọt Lớn", "2 Nước Siêu Lớn"],
      price: 135000,
   },
   {
      id: 10,
      name: "My Combo",
      items: ["1 Bắp Ngọt Lớn", "1 Nước Siêu Lớn"],
      price: 103000,
   },
   {
      id: 11,
      name: "Hotdog Combo",
      items: ["1 phần Hotdog", "1 nước ngọt lớn"],
      price: 70000,
   },
];

const MOCK_BOOKING_DATA: BookingInfo = {
   movie: { title: "Nhà Ba Tôi Một Phòng", format: "2D" },
   cinema: "CGV Aeon Tân Phú",
   screen: "Cinema 6",
   date: "2026-02-18",
   time: "11:00 - 13:29",
   seats: ["C5", "C6"],
   countdown: 600,
};

const OrderSnacksPage: React.FC = () => {
   const navigate = useNavigate();
   const location = useLocation();

   // Get state passed from SeatSelectPage
   const {
      seats = [],
      timing = "",
      totalPrice: ticketPrice = 0,
   } = location.state || {};

   const [quantities, setQuantities] = useState<Record<number, number>>({});

   const updateQuantity = (id: number, delta: number) => {
      setQuantities((prev) => {
         const current = prev[id] || 0;
         const next = Math.max(0, current + delta);
         return { ...prev, [id]: next };
      });
   };

   const snackTotal = PRODUCTS.reduce((sum, product) => {
      return sum + product.price * (quantities[product.id] || 0);
   }, 0);

   const finalTotal = ticketPrice + snackTotal;

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(amount);
   };

   const handleProceed = () => {
      navigate("/checkout", {
         state: {
            seats,
            timing,
            ticketPrice,
            snackTotal,
            finalTotal,
            snacks: PRODUCTS.filter((p) => quantities[p.id] > 0).map((p) => ({
               ...p,
               quantity: quantities[p.id],
            })),
         },
      });
   };

   return (
      <div className="min-h-screen bg-[#0B0B0F] text-white pb-32 pt-24 px-4 md:px-8">
         {/* Header */}
         <div className="max-w-6xl mx-auto mb-8 flex items-center gap-4">
            <button
               onClick={() => navigate(-1)}
               className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
               <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Select Snacks & Drinks</h1>
         </div>

         {/* Booking Info Header */}
         <BookingHeader
            data={
               seats.length > 0
                  ? { ...MOCK_BOOKING_DATA, seats }
                  : MOCK_BOOKING_DATA
            }
         />

         {/* Product List */}
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRODUCTS.map((product) => (
               <div
                  key={product.id}
                  className={cn(
                     "bg-[#1a1a1d] p-4 rounded-xl border border-white/5 flex gap-4 transition-all duration-200",
                     quantities[product.id] > 0
                        ? "border-rose-500/50 bg-[#1a1a1d]/80"
                        : "hover:border-white/10",
                  )}
               >
                  {/* Image Placeholder */}
                  <div className="w-24 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                     <div className="w-full h-full flex items-center justify-center bg-rose-500/10 text-rose-500">
                        <ShoppingBag size={24} />
                     </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                     <div>
                        <h3 className="font-bold text-base text-white mb-1 line-clamp-2">
                           {product.comboName || product.name}
                        </h3>
                        {product.comboName && (
                           <p className="text-xs text-gray-400 mb-1">
                              {product.name}
                           </p>
                        )}

                        {product.items && (
                           <p className="text-xs text-gray-400 mb-1 line-clamp-2">
                              {product.items.join(", ")}
                           </p>
                        )}

                        {product.description && (
                           <p className="text-xs text-gray-500 italic mb-1">
                              {product.description}
                           </p>
                        )}

                        {product.bonus && (
                           <span className="inline-block text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded mt-1">
                              {product.bonus}
                           </span>
                        )}
                        {product.note && (
                           <p className="text-xs text-rose-400 mt-1">
                              *{product.note}
                           </p>
                        )}
                     </div>

                     <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-rose-500 text-base">
                           {formatCurrency(product.price)}
                        </span>

                        <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1">
                           <button
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={!quantities[product.id]}
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                           >
                              <Minus size={16} />
                           </button>
                           <span className="w-6 text-center font-bold">
                              {quantities[product.id] || 0}
                           </span>
                           <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                           >
                              <Plus size={16} />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Checkout Bar */}
         <div className="fixed bottom-0 left-0 w-full bg-[#0B0B0F]/95 backdrop-blur-md border-t border-gray-800 p-4 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase">
                     Total Payment
                  </span>
                  <span className="text-white font-bold text-xl">
                     {formatCurrency(finalTotal)}
                  </span>
                  <span className="text-xs text-gray-500">
                     (Tickets: {formatCurrency(ticketPrice)} + Snacks:{" "}
                     {formatCurrency(snackTotal)})
                  </span>
               </div>

               <button
                  onClick={handleProceed}
                  className="flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
               >
                  Proceed to Payment
                  <ArrowRight className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default OrderSnacksPage;
