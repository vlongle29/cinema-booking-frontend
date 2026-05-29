import { useState, useMemo, useCallback } from "react";
import DashboardEntityList from "../../shared/DashboardEntityList";
import { useBookingList } from "../../../../hooks/useBookingList";
import { getBookingColumns, getBookingFilters } from "./BookingTableConfig";
import { bookingService } from "@/services/bookingService";
import { toast } from "react-hot-toast";

export default function ListBookings() {
   const [isCreating, setIsCreating] = useState(false);
   const [selectedIds, setSelectedIds] = useState<string[]>([]);

   const { bookings, isLoading, searchParams, setSearchParams, pagination } =
      useBookingList();

   const handleAction = useCallback(
      async (id: string, type: string) => {
         if (type === "view") {
            // Logic xem chi tiết đơn hàng
            return;
         }

         if (type === "delete") {
            if (!window.confirm("Bạn có chắc chắn muốn xóa đơn đặt vé này?"))
               return;

            try {
               const response = await bookingService.deleteBooking(id);
               if (response.success) {
                  toast.success("Xóa đơn hàng thành công");
                  // Cập nhật searchParams để trigger re-fetch từ hook useBookingList
                  setSearchParams((prev: any) => ({ ...prev }));
               }
            } catch (error) {
               toast.error("Có lỗi xảy ra khi xóa đơn hàng");
            }
         }
      },
      [setSearchParams],
   );

   const handleSearchChange = (name: string, value: any) => {
      setSearchParams((prev: any) => ({
         ...prev,
         [name]: value || undefined,
         page: 1,
      }));
   };

   const resetFilters = () => {
      setSearchParams({
         page: 1,
         size: 10,
         status: "",
         search: "",
      });
   };

   // 1. Cấu hình columns với handlers
   const columns = useMemo(
      () =>
         getBookingColumns({
            onView: (booking) => handleAction(booking.id, "view"),
            onDelete: (id) => handleAction(id, "delete"),
         }),
      [handleAction],
   );

   // 2. Cấu hình filters
   const filters = useMemo(() => getBookingFilters(), []);

   return (
      <DashboardEntityList
         title="Booking"
         entityName="booking"
         isCreating={isCreating}
         onToggleCreating={() => setIsCreating((prev) => !prev)}
         filters={filters}
         searchParams={searchParams}
         onSearchChange={handleSearchChange}
         onResetFilters={resetFilters}
         data={bookings}
         columns={columns}
         isLoading={isLoading}
         selection={{
            selectedIds,
            onSelectionChange: setSelectedIds,
         }}
         pagination={{
            ...pagination,
            currentPage: searchParams.page,
            pageSize: searchParams.size,
         }}
         onPageChange={(page) =>
            setSearchParams((prev: any) => ({ ...prev, page }))
         }
         renderCreateForm={() => (
            <div className="text-white p-4">
               Việc tạo đặt chỗ được thực hiện qua ứng dụng khách hàng.
            </div>
         )}
      />
   );
}
