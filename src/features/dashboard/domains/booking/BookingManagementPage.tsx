import { useState, useMemo, useCallback } from "react";
import DashboardEntityList from "../../shared/DashboardEntityList";
import { useBookingList } from "../../../../hooks/useBookingList";
import { getBookingColumns, getBookingFilters } from "./BookingTableConfig";
import { bookingService } from "@/services/bookingService";
import { toast } from "react-hot-toast";
import BookingDetailModal from "./ViewDetailBookingForm";

export default function ListBookings() {
   const [isCreating, setIsCreating] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [selectedIds, setSelectedIds] = useState<string[]>([]);

   // ── Detail dialog state ──────────────────────────────────────────────────
   const [isViewingDetail, setIsViewingDetail] = useState(false);
   const [bookingDetail, setBookingDetail] = useState<any>(null);
   const [isDetailLoading, setIsDetailLoading] = useState(false);

   const { bookings, isLoading, searchParams, setSearchParams, pagination } =
      useBookingList();

   const handleViewDetail = useCallback(async (booking: any) => {
      setIsViewingDetail(true);
      setBookingDetail(null);
      setIsDetailLoading(true);
      try {
         const response = await bookingService.getBookingDetails(booking.id);
         if (response.success) {
            setBookingDetail(response.data);
         } else {
            toast.error("Không thể tải chi tiết đơn hàng");
         }
      } catch {
         toast.error("Có lỗi xảy ra khi tải chi tiết đơn hàng");
      } finally {
         setIsDetailLoading(false);
      }
   }, []);

   const handleAction = useCallback(
      async (id: string, type: string) => {
         if (type === "delete") {
            if (!window.confirm("Bạn có chắc chắn muốn xóa đơn đặt vé này?"))
               return;

            try {
               const response = await bookingService.deleteBooking(id);
               if (response.success) {
                  toast.success("Xóa đơn hàng thành công");
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
         keyword: "",
      });
   };

   // 1. Cấu hình columns với handlers
   const columns = useMemo(
      () =>
         getBookingColumns({
            onView: (booking) => handleViewDetail(booking),
            onDelete: (id) => handleAction(id, "delete"),
         }),
      [handleViewDetail, handleAction],
   );

   // 2. Cấu hình filters
   const filters = useMemo(() => getBookingFilters(), []);

   return (
      <>
         <DashboardEntityList
            title="Booking"
            entityName="booking"
            isCreating={isCreating}
            onToggleCreating={() => setIsCreating((prev) => !prev)}
            isEditing={isEditing}
            onToggleEditing={() => setIsEditing((prev) => !prev)}
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
            renderEditForm={() => null}
         />

         {/* Booking Detail Dialog */}
         <BookingDetailModal
            isOpen={isViewingDetail}
            onClose={() => {
               setIsViewingDetail(false);
               setBookingDetail(null);
            }}
            data={bookingDetail}
            isLoading={isDetailLoading}
         />
      </>
   );
}
