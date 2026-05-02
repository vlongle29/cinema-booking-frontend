import React, { useState, useEffect } from "react";
import {
   Search,
   Filter,
   Calendar,
   MoreVertical,
   Eye,
   XCircle,
   RotateCcw,
   ChevronLeft,
   ChevronRight,
   Download,
   AlertCircle,
} from "lucide-react";
import { bookingService, BookingListItem } from "../../services/bookingService";

/**
 * Status Badge Component
 */
const StatusBadge = ({ status }: { status: string }) => {
   const styles: Record<string, string> = {
      PAID: "bg-green-500/10 text-green-500 border-green-500/20",
      PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
      EXPIRED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
   };

   return (
      <span
         className={`px-2 py-1 rounded-full text-[10px] font-bold border ${styles[status] || styles.PENDING}`}
      >
         {status}
      </span>
   );
};

export default function ListBookings() {
   const [bookings, setBookings] = useState<BookingListItem[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("ALL");
   const [isLoading, setIsLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(0);
   const [totalElements, setTotalElements] = useState(0);
   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

   const fetchBookings = async () => {
      setIsLoading(true);
      try {
         const params = {
            page: currentPage,
            size: pageSize,
            status: statusFilter === "ALL" ? undefined : statusFilter,
            search: searchTerm || undefined,
         };

         const response = await bookingService.searchBookings(params);
         if (response.success && response.data) {
            setBookings(response.data.content);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
         }
      } catch (error) {
         console.error("Failed to fetch bookings:", error);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchBookings();
   }, [currentPage, pageSize, statusFilter, searchTerm]);

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="mb-12 mt-6 flex justify-between items-end">
            <div>
               <h1 className="text-4xl font-semibold text-white">
                  Booking{" "}
                  <span className="underline decoration-[#f84565] text-[#f84565]">
                     Management
                  </span>
               </h1>
               <p className="text-[#797b7d] mt-2 text-sm">
                  Monitor and manage all movie ticket transactions.
               </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] text-white rounded-[6px] hover:bg-[#f84565] transition-all text-sm font-medium">
               <Download size={16} /> Export CSV
            </button>
         </div>

         {/* Filter Bar */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[rgba(248,69,101,0.05)] border border-[rgba(248,69,101,0.1)] p-4 rounded-[8px]">
            <div className="relative">
               <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#797b7d]"
                  size={18}
               />
               <input
                  type="text"
                  placeholder="Booking code or phone..."
                  className="w-full bg-[#09090b] border border-[#393939] rounded-[6px] pl-10 pr-4 py-2 text-white text-sm focus:border-[#f84565] outline-none transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            <div className="relative">
               <Filter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#797b7d]"
                  size={16}
               />
               <select
                  className="w-full bg-[#09090b] border border-[#393939] rounded-[6px] pl-10 pr-4 py-2 text-white text-sm focus:border-[#f84565] outline-none appearance-none transition-colors"
                  value={statusFilter}
                  onChange={(e) => {
                     setStatusFilter(e.target.value);
                     setCurrentPage(1);
                  }}
               >
                  <option value="ALL">All Status</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="EXPIRED">Expired</option>
               </select>
            </div>

            <div className="relative md:col-span-2 flex gap-2">
               <div className="relative flex-1">
                  <Calendar
                     className="absolute left-3 top-1/2 -translate-y-1/2 text-[#797b7d]"
                     size={16}
                  />
                  <input
                     type="date"
                     className="w-full bg-[#09090b] border border-[#393939] rounded-[6px] pl-10 pr-4 py-2 text-white text-sm focus:border-[#f84565] outline-none transition-colors"
                  />
               </div>
               <div className="relative flex-1">
                  <Calendar
                     className="absolute left-3 top-1/2 -translate-y-1/2 text-[#797b7d]"
                     size={16}
                  />
                  <input
                     type="date"
                     className="w-full bg-[#09090b] border border-[#393939] rounded-[6px] pl-10 pr-4 py-2 text-white text-sm focus:border-[#f84565] outline-none transition-colors"
                  />
               </div>
            </div>
         </div>

         {/* Main Table Section */}
         <div className="bg-[rgba(248,69,101,0.02)] border border-[rgba(248,69,101,0.1)] rounded-[8px] overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-[#393939] bg-[rgba(248,69,101,0.05)]">
                        <th className="p-4 text-xs font-semibold text-[#797b7d] uppercase tracking-wider">
                           Booking Code
                        </th>
                        <th className="p-4 text-xs font-semibold text-[#797b7d] uppercase tracking-wider">
                           Customer
                        </th>
                        <th className="p-4 text-xs font-semibold text-[#797b7d] uppercase tracking-wider">
                           Movie
                        </th>
                        <th className="p-4 text-xs font-semibold text-[#797b7d] uppercase tracking-wider">
                           Showtime
                        </th>
                        <th className="p-4 text-xs font-semibold text-[#797b7d] uppercase tracking-wider">
                           Seats
                        </th>
                        <th className="p-4 text-xs font-semibold text-[#797b7d] uppercase tracking-wider">
                           Total
                        </th>
                        <th className="p-4 text-xs font-semibold text-[#797b7d] uppercase tracking-wider">
                           Status
                        </th>
                        <th className="p-4 text-xs font-semibold text-[#797b7d] uppercase tracking-wider text-right">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#393939]">
                     {isLoading ? (
                        // Skeleton Loader
                        [...Array(5)].map((_, i) => (
                           <tr key={i} className="animate-pulse">
                              {[...Array(8)].map((_, j) => (
                                 <td key={j} className="p-4">
                                    <div className="h-4 bg-[#393939] rounded w-full"></div>
                                 </td>
                              ))}
                           </tr>
                        ))
                     ) : bookings.length > 0 ? (
                        bookings.map((booking) => (
                           <tr
                              key={booking.id}
                              className="hover:bg-[rgba(248,69,101,0.03)] transition-colors group"
                           >
                              <td className="p-4">
                                 <span className="text-[#f84565] font-medium cursor-pointer hover:underline">
                                    {booking.id.substring(0, 8).toUpperCase()}
                                 </span>
                                 <div className="text-[10px] text-[#797b7d] mt-1">
                                    {new Intl.DateTimeFormat("vi-VN").format(
                                       new Date(booking.bookingDate),
                                    )}
                                 </div>
                              </td>
                              <td className="p-4 text-white">
                                 <div className="font-medium text-sm">
                                    {booking.customerId
                                       ? `Customer: ${booking.customerId.substring(0, 8)}`
                                       : "Guest"}
                                 </div>
                                 <div className="text-xs text-[#797b7d]">
                                    {booking.paymentMethod || "N/A"}
                                 </div>
                              </td>
                              <td className="p-4">
                                 <div className="text-sm text-white line-clamp-1 w-40 font-medium">
                                    Showtime:{" "}
                                    {booking.showtimeId.substring(0, 8)}
                                 </div>
                              </td>
                              <td className="p-4 text-sm text-[#d1d5dc]">
                                 {new Intl.DateTimeFormat("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                 }).format(new Date(booking.bookingDate))}
                              </td>
                              <td className="p-4">
                                 <div className="flex gap-1 flex-wrap">
                                    {Array.isArray(booking.tickets) ? (
                                       booking.tickets.map((t: any) => (
                                          <span
                                             key={t.id}
                                             className="bg-[#393939] text-white text-[10px] px-1.5 rounded"
                                          >
                                             {t.seatNumber || "Seat"}
                                          </span>
                                       ))
                                    ) : (
                                       <span className="text-[#797b7d] text-xs">
                                          No tickets
                                       </span>
                                    )}
                                 </div>
                              </td>
                              <td className="p-4 text-white font-semibold">
                                 {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                 }).format(booking.finalAmount)}
                              </td>
                              <td className="p-4">
                                 <StatusBadge status={booking.status} />
                              </td>
                              <td className="p-4 text-right relative">
                                 <button
                                    onClick={() =>
                                       setOpenDropdown(
                                          openDropdown === booking.id
                                             ? null
                                             : booking.id,
                                       )
                                    }
                                    className="p-2 text-[#797b7d] hover:text-white transition-colors"
                                 >
                                    <MoreVertical size={18} />
                                 </button>

                                 {/* Dropdown Menu */}
                                 {openDropdown === booking.id && (
                                    <>
                                       <div
                                          className="fixed inset-0 z-10"
                                          onClick={() => setOpenDropdown(null)}
                                       />
                                       <div className="absolute right-4 top-12 w-44 bg-[#121214] border border-[#393939] rounded-[6px] shadow-2xl z-20 overflow-hidden">
                                          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white hover:bg-[rgba(248,69,101,0.1)] transition-colors text-left">
                                             <Eye
                                                size={14}
                                                className="text-[#797b7d]"
                                             />{" "}
                                             View Details
                                          </button>
                                          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white hover:bg-[rgba(248,69,101,0.1)] transition-colors text-left">
                                             <RotateCcw
                                                size={14}
                                                className="text-[#797b7d]"
                                             />{" "}
                                             Process Refund
                                          </button>
                                          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left border-t border-[#393939]">
                                             <XCircle size={14} /> Cancel
                                             Booking
                                          </button>
                                       </div>
                                    </>
                                 )}
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={8} className="p-20 text-center">
                              <div className="flex flex-col items-center gap-3">
                                 <AlertCircle
                                    size={48}
                                    className="text-[#393939]"
                                 />
                                 <p className="text-[#797b7d] text-lg font-medium">
                                    No bookings found
                                 </p>
                                 <p className="text-[#393939] text-sm">
                                    Try adjusting your filters or search terms
                                 </p>
                              </div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#393939] bg-[rgba(248,69,101,0.02)] flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <span className="text-xs text-[#797b7d]">
                     Showing{" "}
                     <span className="text-white">
                        {(currentPage - 1) * pageSize + 1}
                     </span>{" "}
                     to{" "}
                     <span className="text-white">
                        {Math.min(currentPage * pageSize, totalElements)}
                     </span>{" "}
                     of <span className="text-white">{totalElements}</span>{" "}
                     entries
                  </span>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] text-[#797b7d] uppercase font-bold">
                        Rows:
                     </span>
                     <select
                        className="bg-transparent text-xs text-white outline-none cursor-pointer"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                     >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                     </select>
                  </div>
               </div>

               <div className="flex items-center gap-1">
                  <button
                     disabled={currentPage === 1}
                     className="p-1 text-[#797b7d] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                     <ChevronLeft size={20} />
                  </button>
                  {Array.from(
                     { length: Math.min(totalPages, 5) },
                     (_, i) => i + 1,
                  ).map((num) => (
                     <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`w-8 h-8 rounded-[4px] text-xs font-medium transition-all ${
                           currentPage === num
                              ? "bg-[#f84565] text-white shadow-[0_0_15px_rgba(248,69,101,0.3)]"
                              : "text-[#797b7d] hover:bg-[rgba(248,69,101,0.1)] hover:text-white"
                        }`}
                     >
                        {num}
                     </button>
                  ))}
                  <button
                     disabled={currentPage === totalPages}
                     onClick={() => setCurrentPage((prev) => prev + 1)}
                     className="p-1 text-[#797b7d] hover:text-white disabled:opacity-30 transition-colors"
                  >
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>
         </div>

         {/* Footer Stats Summary (Optional) */}
         <div className="grid grid-cols-3 gap-6 pt-6">
            <div className="p-4 bg-[rgba(248,69,101,0.05)] border border-[rgba(248,69,101,0.1)] rounded-[8px]">
               <p className="text-[#797b7d] text-[10px] uppercase font-bold tracking-widest mb-1">
                  Today's Revenue
               </p>
               <p className="text-2xl font-semibold text-white">$1,240.00</p>
            </div>
            <div className="p-4 bg-[rgba(248,69,101,0.05)] border border-[rgba(248,69,101,0.1)] rounded-[8px]">
               <p className="text-[#797b7d] text-[10px] uppercase font-bold tracking-widest mb-1">
                  Pending Orders
               </p>
               <p className="text-2xl font-semibold text-[#f84565]">12</p>
            </div>
            <div className="p-4 bg-[rgba(248,69,101,0.05)] border border-[rgba(248,69,101,0.1)] rounded-[8px]">
               <p className="text-[#797b7d] text-[10px] uppercase font-bold tracking-widest mb-1">
                  Success Rate
               </p>
               <p className="text-2xl font-semibold text-white">98.4%</p>
            </div>
         </div>
      </div>
   );
}
