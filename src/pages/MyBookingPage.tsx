import React from "react";

const bookings = [
   {
      id: 1,
      movie: "Alita Battle Angel 2024",
      image: "http://localhost:3845/assets/1b26250be4903592d678845efae190b5f9bb5ea4.png",
      duration: "2 hours 15 minutes",
      date: "13th May 2025 • 5:00 PM",
      tickets: 2,
      seats: "B12, B13",
      price: "₹700",
   },
   {
      id: 2,
      movie: "Alita Battle Angel 2024",
      image: "http://localhost:3845/assets/1b26250be4903592d678845efae190b5f9bb5ea4.png",
      duration: "2 hours 15 minutes",
      date: "13th May 2025 • 5:00 PM",
      tickets: 2,
      seats: "B12, B13",
      price: "₹700",
   },
];

const MyBookingPage: React.FC = () => {
   return (
      <div className="mt-16 bg-[#09090b] min-h-screen text-gray-200">
         <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-300 mb-8">
               My Bookings
            </h1>
            <div className="flex flex-col gap-8">
               {bookings.map((b) => (
                  <div
                     key={b.id}
                     className="flex items-center bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-lg p-6 gap-8"
                  >
                     <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                           src={b.image}
                           alt={b.movie}
                           className="w-full h-full object-cover"
                        />
                     </div>
                     <div className="flex-1">
                        <h2 className="text-xl font-semibold text-white mb-2">
                           {b.movie}
                        </h2>
                        <p className="text-sm text-gray-400 mb-1">
                           {b.duration}
                        </p>
                        <p className="text-sm text-gray-400 mb-2">{b.date}</p>
                        <div className="flex gap-6 mt-2 text-sm text-gray-400">
                           <div>
                              Total Tickets:{" "}
                              <span className="text-white font-medium">
                                 {b.tickets}
                              </span>
                           </div>
                           <div>
                              Seat Number:{" "}
                              <span className="text-white font-medium">
                                 {b.seats}
                              </span>
                           </div>
                        </div>
                     </div>
                     <div className="text-right min-w-[80px]">
                        <p className="text-2xl font-bold text-white">
                           {b.price}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default MyBookingPage;
