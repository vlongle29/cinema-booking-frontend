import { useState, useMemo } from "react";
import { useCreateShowtime } from "../../../../hooks/useCreateShowtime";
import DashboardEntityList from "../../shared/DashboardEntityList";
import { useShowtimeList } from "../../../../hooks/useShowtimeList";
import { getShowtimeColumns, getShowtimeFilters } from "./ShowtimeTableConfig";
import CreateShowtimeForm from "./CreateShowtimeForm";

export default function ListShows() {
   const [isCreating, setIsCreating] = useState(false);

   // Hook xử lý form tạo mới
   const { formData, updateField, toggleSlot, submitForm, options, status } =
      useCreateShowtime();

   // Hook xử lý danh sách
   const {
      showtimes,
      isLoadingList,
      searchParams,
      setSearchParams,
      pagination,
      handleDelete,
      // handleUpdate,
   } = useShowtimeList(isCreating);

   // Xử lý thay đổi filter (có kết hợp updateField của hook CreateShowtime)
   const handleSearchChange = (name: string, value: any) => {
      setSearchParams((prev) => ({
         ...prev,
         [name]: value || undefined,
         page: 1,
      }));

      if (name === "cityId") {
         setSearchParams((prev) => ({
            ...prev,
            branchId: undefined,
            roomId: undefined,
            cityId: value || undefined,
         }));
         updateField("cityId", value);
      } else if (name === "branchId") {
         setSearchParams((prev) => ({
            ...prev,
            roomId: undefined,
            branchId: value || undefined,
         }));
         updateField("branchId", value);
      }
   };

   const resetFilters = () => {
      setSearchParams({
         page: 1,
         size: 10,
         sortBy: "startTime",
         sortDirection: "DESC",
      });
      updateField("cityId", "");
      updateField("branchId", "");
   };

   const handleSubmitForm = async (e: React.FormEvent) => {
      e.preventDefault();
      await submitForm();
   };

   // Lấy config từ file ngoài
   const columns = useMemo(
      () =>
         getShowtimeColumns({
            onEdit: (show) => {
               console.log("Edit showtime:", show);
               // Logic mở form edit ở đây
            },
            onDelete: handleDelete,
         }),
      [handleDelete],
   );

   const filters = useMemo(
      () => getShowtimeFilters(options, searchParams),
      [options, searchParams],
   );

   return (
      <DashboardEntityList
         title="Showtime"
         entityName="showtime"
         isCreating={isCreating}
         onToggleCreating={() => setIsCreating((prev) => !prev)}
         filters={filters}
         searchParams={searchParams}
         onSearchChange={handleSearchChange}
         onResetFilters={resetFilters}
         data={showtimes}
         columns={columns}
         isLoading={isLoadingList}
         pagination={{
            totalPages: pagination.totalPages,
            totalElements: pagination.totalElements,
            currentPage: searchParams.page || 1,
            pageSize: searchParams.size || 10,
         }}
         onPageChange={(page) => setSearchParams((prev) => ({ ...prev, page }))}
         renderCreateForm={() => (
            <CreateShowtimeForm
               formData={formData}
               options={options}
               status={status}
               updateField={updateField}
               toggleSlot={toggleSlot}
               onSubmit={handleSubmitForm}
               onCancel={() => setIsCreating(false)}
            />
         )}
      />
   );
}
