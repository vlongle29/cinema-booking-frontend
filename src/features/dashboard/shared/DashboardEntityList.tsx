import React, { type ReactNode } from "react";
import {
   Box,
   Typography,
   Button,
   Grid,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   TextField,
   MenuItem,
   Select,
   CircularProgress,
   IconButton,
   type SelectChangeEvent,
} from "@mui/material";
import {
   Plus,
   X,
   Filter,
   RefreshCw,
   Search as SearchIcon,
   ChevronLeft,
   ChevronRight,
} from "lucide-react";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/common/pagination";
import {
   Dialog,
   DialogContent,
} from "@/components/ui/dialog";

export interface Column<T> {
   id: string;
   label: string;
   render?: (item: T) => ReactNode;
   align?: "left" | "right" | "center";
   width?: string | number;
}

export interface FilterField {
   name: string;
   label: string;
   type: "text" | "select" | "date";
   placeholder?: string;
   options?: { value: string | number; label: string }[];
   disabled?: boolean;
}

interface DashboardEntityListProps<T> {
   title: string;
   entityName: string;
   isCreating: boolean;
   onToggleCreating: () => void;
   isEditing: boolean;
   onToggleEditing: () => void;

   // Filters
   filters: FilterField[];
   searchParams: any;
   onSearchChange: (name: string, value: any) => void;
   onResetFilters: () => void;

   // List Data
   data: T[];
   columns: Column<T>[];
   isLoading: boolean;

   // Pagination
   pagination: {
      totalPages: number;
      totalElements: number;
      currentPage: number;
      pageSize: number;
   };
   onPageChange: (newPage: number) => void;

   // Form
   renderCreateForm: () => ReactNode;
   renderEditForm: () => ReactNode;
   renderCustomList?: (data: T[]) => ReactNode; // Giữ lại để dự phòng
   renderTopContent?: (data: T[]) => ReactNode; // Thêm slot mới

   // Selection
   selection?: {
      selectedIds: string[];
      onSelectionChange: (ids: string[]) => void;
   };

   // Custom Messages
   emptyMessage?: string;
   loadingMessage?: string;
}

const DASHBOARD_BG = "#1a1a1e";
const DASHBOARD_BORDER = "#393939";
const DASHBOARD_ACCENT = "#f84565";
const DASHBOARD_TEXT_MUTED = "#797b7d";

export default function DashboardEntityList<T>({
   title,
   entityName,
   isCreating,
   onToggleCreating,
   isEditing,
   onToggleEditing,
   filters,
   searchParams,
   onSearchChange,
   onResetFilters,
   data,
   columns,
   isLoading,
   pagination,
   onPageChange,
   renderCreateForm,
   renderEditForm,
   emptyMessage = "No matching items found.",
   loadingMessage = "Searching items...",
   renderCustomList,
   renderTopContent,
   selection,
}: DashboardEntityListProps<T>) {
   const handleFilterChange = (
      e:
         | React.ChangeEvent<
              | HTMLInputElement
              | HTMLSelectElement
              | { name?: string; value: unknown }
           >
         | SelectChangeEvent<any>,
   ) => {
      const { name, value } = e.target;
      if (name) {
         onSearchChange(name, value);
      }
   };

   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (selection) {
         selection.onSelectionChange(e.target.checked ? data.map((item: any) => item.id) : []);
      }
   };

   const handleSelectRow = (id: string) => {
      if (!selection) return;
      const newSelected = selection.selectedIds.includes(id)
         ? selection.selectedIds.filter(item => item !== id)
         : [...selection.selectedIds, id];
      selection.onSelectionChange(newSelected);
   };

   return (
      <Box sx={{ width: "100%" }}>
         {/* --- Header --- */}
         <Box
            sx={{
               mb: 4,
               mt: 2,
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
            }}
         >
            <Typography
               variant="h5"
               component="h1"
               sx={{ fontWeight: 600, color: "white" }}
            >
               {isCreating ? "" : "Danh sách "}
               <Box
                  component="span"
                  sx={{
                     textDecoration: "underline",
                     textDecorationColor: DASHBOARD_ACCENT,
                     color: DASHBOARD_ACCENT,
                  }}
               >
                  {title}
               </Box>
            </Typography>

               <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={onToggleCreating}
                  sx={{
                     bgcolor: DASHBOARD_ACCENT,
                     "&:hover": { bgcolor: DASHBOARD_ACCENT + "e6" },
                     textTransform: "none",
                     fontWeight: 600,
                     borderRadius: 1.5,
                     px: 3,
                  }}
               >
                   Thêm {title}
               </Button>
         </Box>

         <Dialog open={isCreating} onOpenChange={(open) => { if (!open && isCreating) onToggleCreating(); }}>
            <DialogContent 
               showCloseButton={false}
               className="max-w-3xl w-[95vw] bg-[#131316] border border-[#2a2a2e] text-white p-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] gap-0"
            >
               {/* Header */}
               <div className="relative flex items-center justify-between px-6 py-5 border-b border-[#2a2a2e] bg-gradient-to-r from-[#1a1a1e] to-[#131316]">
                  <div className="flex items-center gap-3">
                     <div className="text-left">
                        <h2 className="text-white font-semibold text-base leading-none">Thêm mới {title}</h2>
                        <p className="text-[#797b7d] text-xs mt-1">
                            Điền thông tin dưới đây</p>  
                     </div>   
                  </div>
                  <button
                        onClick={() => onToggleCreating()}
                     className="
                  w-8 h-8
                  flex items-center justify-center
                  bg-transparent
                  text-white
                  border-0
                  outline-none
                  focus:outline-none
                  focus:ring-0
                  ring-0
                  hover:bg-transparent
                  active:bg-transparent
                  "
                  title="Đóng"
               >
                  X
               </button>
               </div>
               {/* Body */}
               <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
                  {renderCreateForm()}
               </div>
            </DialogContent>
         </Dialog>

         <Dialog open={isEditing} onOpenChange={(open) => { if (!open && isEditing) onToggleEditing(); }}>
            <DialogContent 
               showCloseButton={false}
               className="max-w-3xl w-[95vw] bg-[#131316] border border-[#2a2a2e] text-white p-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] gap-0"
            >
               {/* Header */}
               <div className="relative flex items-center justify-between px-6 py-5 border-b border-[#2a2a2e] bg-gradient-to-r from-[#1a1a1e] to-[#131316]">
                  <div className="flex items-center gap-3">
                     <div className="text-left">
                        <h2 className="text-white font-semibold text-base leading-none">Chỉnh sửa {title}</h2>
                        <p className="text-[#797b7d] text-xs mt-1">
                            Sửa đổi thông tin dưới đây</p>  
                     </div>   
                  </div>
                  <button
                        onClick={() => onToggleEditing()}
                     className="
                  w-8 h-8
                  flex items-center justify-center
                  bg-transparent
                  text-white
                  border-0
                  outline-none
                  focus:outline-none
                  focus:ring-0
                  ring-0
                  hover:bg-transparent
                  active:bg-transparent
                  "
                  title="Đóng"
               >
                  X
               </button>
               </div>
               {/* Body */}
               <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
                  {renderEditForm?.()}
               </div>
            </DialogContent>
         </Dialog>

         <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
               {/* --- Filters --- */}
               <Paper
                  elevation={0}
                  sx={{
                     p: 3,
                     bgcolor: DASHBOARD_BG,
                     border: `1px solid ${DASHBOARD_BORDER}`,
                     borderRadius: 2,
                  }}
               >
                  <Box
                     sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 3,
                     }}
                  >
                     <Filter size={16} color={DASHBOARD_ACCENT} />
                     <Typography
                        sx={{
                           color: "white",
                           fontWeight: 600,
                           fontSize: "0.875rem",
                        }}
                     >
                        Search Filters
                     </Typography>
                  </Box>

                  <Grid container spacing={2}>
                     {filters.map((filter) => (
                        <Grid
                           item
                           xs={12}
                           sm={6}
                           md={3}
                           lg={2}
                           key={filter.name}
                        >
                           <Typography
                              variant="caption"
                              sx={{
                                 display: "block",
                                 mb: 0.5,
                                 color: DASHBOARD_TEXT_MUTED,
                                 textTransform: "uppercase",
                                 fontWeight: 700,
                                 letterSpacing: 1,
                              }}
                           >
                              {filter.label}
                           </Typography>
                           {filter.type === "select" ? (
                              <Select
                                 name={filter.name}
                                 value={searchParams[filter.name] || ""}
                                 onChange={handleFilterChange as any}
                                 disabled={filter.disabled}
                                 fullWidth
                                 size="small"
                                 displayEmpty
                                 sx={{
                                    bgcolor: "#252529",
                                    color: "white",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                       borderColor: DASHBOARD_BORDER,
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                       { borderColor: DASHBOARD_ACCENT },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                       { borderColor: DASHBOARD_ACCENT },
                                    fontSize: "0.75rem",
                                    borderRadius: 1.5,
                                 }}
                              >
                                 <MenuItem value="">
                                    {filter.placeholder ||
                                       `All ${filter.label}s`}
                                 </MenuItem>
                                 {filter.options?.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                       {opt.label}
                                    </MenuItem>
                                 ))}
                              </Select>
                           ) : (
                              <TextField
                                 name={filter.name}
                                 type={filter.type}
                                 value={searchParams[filter.name] || ""}
                                 onChange={handleFilterChange}
                                 disabled={filter.disabled}
                                 placeholder={filter.placeholder}
                                 fullWidth
                                 size="small"
                                 inputProps={{
                                    sx: {
                                       color: "white",
                                       fontSize: "0.75rem",
                                       p: "8.5px 14px",
                                       colorScheme: "dark",
                                    },
                                 }}
                                 sx={{
                                    bgcolor: "#252529",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                       borderColor: DASHBOARD_BORDER,
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                       { borderColor: DASHBOARD_ACCENT },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                       { borderColor: DASHBOARD_ACCENT },
                                    borderRadius: 1.5,
                                    "& input::-webkit-calendar-picker-indicator":
                                       { filter: "invert(1)" },
                                 }}
                              />
                           )}
                        </Grid>
                     ))}
                  </Grid>

                  <Box
                     sx={{
                        mt: 3,
                        pt: 3,
                        borderTop: `1px solid ${DASHBOARD_BORDER}`,
                        display: "flex",
                        justifyContent: "flex-end",
                     }}
                  >
                     <Button
                        variant="outlined"
                        startIcon={<RefreshCw size={14} />}
                        onClick={onResetFilters}
                        sx={{
                           color: "#d1d5dc",
                           borderColor: DASHBOARD_BORDER,
                           textTransform: "none",
                           fontWeight: 600,
                           fontSize: "0.75rem",
                           "&:hover": {
                              bgcolor: "#252529",
                              borderColor: DASHBOARD_BORDER,
                           },
                           borderRadius: 1.5,
                        }}
                     >
                        Reset Filters
                     </Button>
                  </Box>
               </Paper>

               {/* --- List Section --- */}
               {isLoading ? (
                  <Paper
                     elevation={0}
                     sx={{
                        p: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: DASHBOARD_BG,
                        border: `1px solid ${DASHBOARD_BORDER}`,
                        borderRadius: 2,
                     }}
                  >
                     <CircularProgress
                        size={40}
                        sx={{ color: DASHBOARD_ACCENT, mb: 2 }}
                     />
                     <Typography
                        variant="body2"
                        sx={{ color: DASHBOARD_TEXT_MUTED }}
                     >
                        {loadingMessage}
                     </Typography>
                  </Paper>
               ) : data.length > 0 ? (
                  <Box
                     sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                     {renderTopContent && renderTopContent(data)}
                     {renderCustomList ? (
                        renderCustomList(data)
                     ) : (
                        <Paper
                           elevation={0}
                           sx={{
                              bgcolor: DASHBOARD_BG,
                              border: `1px solid ${DASHBOARD_BORDER}`,
                              borderRadius: 2,
                              overflow: "hidden",
                           }}
                        >
                           <TableContainer>
                              <Table sx={{ minWidth: 650 }}>
                                 <TableHead sx={{ bgcolor: "#252529" }}>
                                    <TableRow>
                                       {selection && (
                                          <TableCell sx={{ width: 50, borderBottom: `1px solid ${DASHBOARD_BORDER}`, px: 3 }}>
                                             <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-[#f84565] focus:ring-[#f84565] cursor-pointer"
                                                onChange={handleSelectAll}
                                                checked={
                                                   data.length > 0 &&
                                                   selection.selectedIds.length === data.length
                                                }
                                             />
                                          </TableCell>
                                       )}
                                       {columns.map((col) => (
                                          <TableCell
                                             key={col.id}
                                             align={col.align}
                                             style={{ width: col.width }}
                                             sx={{
                                                color: DASHBOARD_TEXT_MUTED,
                                                fontSize: "10px",
                                                fontWeight: 700,
                                                textTransform: "uppercase",
                                                letterSpacing: 1,
                                                borderBottom: `1px solid ${DASHBOARD_BORDER}`,
                                                px: 3,
                                                py: 2,
                                             }}
                                          >
                                             {col.label}
                                          </TableCell>
                                       ))}
                                    </TableRow>
                                 </TableHead>
                                 <TableBody>
                                    {data.map((item: any, index: number) => (
                                       <TableRow
                                          key={item.id || index}
                                          sx={{
                                             "&:hover": {
                                                bgcolor:
                                                   "rgba(255,255,255,0.02)",
                                             },
                                             "& .MuiTableCell-root": {
                                                borderBottom: `1px solid ${DASHBOARD_BORDER}`,
                                                px: 3,
                                                py: 2,
                                             },
                                          }}
                                       >
                                          {selection && (
                                             <TableCell>
                                                <input
                                                   type="checkbox"
                                                   className="w-4 h-4 rounded border-gray-300 text-[#f84565] focus:ring-[#f84565] cursor-pointer"
                                                   checked={selection.selectedIds.includes(item.id)}
                                                   onChange={() => handleSelectRow(item.id)}
                                                />
                                             </TableCell>
                                          )}
                                          {columns.map((col) => (
                                             <TableCell
                                                key={col.id}
                                                align={col.align}
                                             >
                                                {col.render
                                                   ? col.render(item)
                                                   : (item as any)[col.id]}
                                             </TableCell>
                                          ))}
                                       </TableRow>
                                    ))}
                                 </TableBody>
                              </Table>
                           </TableContainer>
                        </Paper>
                     )}

                     {/* Pagination */}
                     <Paper
                        sx={{
                           p: 2,
                           bgcolor: DASHBOARD_BG,
                           border: `1px solid ${DASHBOARD_BORDER}`,
                           borderRadius: 2,
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "space-between",
                        }}
                     >
                        <Typography
                           variant="caption"
                           sx={{ color: DASHBOARD_TEXT_MUTED }}
                        >
                           Found{" "}
                           <Box
                              component="span"
                              sx={{ color: "white", fontWeight: 700 }}
                           >
                              {pagination.totalElements}
                           </Box>{" "}
                           {entityName}s
                        </Typography>

                        <Pagination>
                           <PaginationContent>
                              <PaginationItem>
                                 <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                       e.preventDefault();
                                       if (pagination.currentPage > 1)
                                          onPageChange(
                                             pagination.currentPage - 1,
                                          );
                                    }}
                                    className={
                                       pagination.currentPage <= 1
                                          ? "pointer-events-none opacity-20 text-white"
                                          : "cursor-pointer text-white hover:bg-white/10"
                                    }
                                 />
                              </PaginationItem>

                              {Array.from(
                                 { length: pagination.totalPages },
                                 (_, i) => i + 1,
                              )
                                 .filter((page) => {
                                    const { currentPage, totalPages } =
                                       pagination;
                                    // Hiển thị trang đầu, trang cuối và các trang lân cận trang hiện tại
                                    return (
                                       page === 1 ||
                                       page === totalPages ||
                                       (page >= currentPage - 1 &&
                                          page <= currentPage + 1)
                                    );
                                 })
                                 .map((page, index, array) => {
                                    const items = [];
                                    // Thêm dấu ba chấm nếu có khoảng cách giữa các số trang
                                    if (
                                       index > 0 &&
                                       page - array[index - 1] > 1
                                    ) {
                                       items.push(
                                          <PaginationItem
                                             key={`ellipsis-${page}`}
                                          >
                                             {/* <PaginationEllipsis className="text-white opacity-50" /> */}
                                          </PaginationItem>,
                                       );
                                    }
                                    items.push(
                                       <PaginationItem key={page}>
                                          <PaginationLink
                                             href="#"
                                             isActive={
                                                pagination.currentPage === page
                                             }
                                             onClick={(e) => {
                                                e.preventDefault();
                                                onPageChange(page);
                                             }}
                                             className={`cursor-pointer ${pagination.currentPage === page ? "bg-[#f84565] border-[#f84565] text-white hover:bg-[#b32d46] hover:text-white" : "text-white hover:bg-white/10 hover:text-white"}`}
                                          >
                                             {page}
                                          </PaginationLink>
                                       </PaginationItem>,
                                    );
                                    return items;
                                 })}

                              <PaginationItem>
                                 <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                       e.preventDefault();
                                       if (
                                          pagination.currentPage <
                                          pagination.totalPages
                                       )
                                          onPageChange(
                                             pagination.currentPage + 1,
                                          );
                                    }}
                                    className={
                                       pagination.currentPage >=
                                       pagination.totalPages
                                          ? "pointer-events-none opacity-20 text-white"
                                          : "cursor-pointer text-white hover:bg-white/10"
                                    }
                                 />
                              </PaginationItem>
                           </PaginationContent>
                        </Pagination>
                     </Paper>
                  </Box>
               ) : (
                  <Paper
                     elevation={0}
                     sx={{
                        p: 12,
                        textAlign: "center",
                        bgcolor: DASHBOARD_BG,
                        border: `1px solid ${DASHBOARD_BORDER}`,
                        borderRadius: 2,
                     }}
                  >
                     <SearchIcon
                        size={64}
                        style={{
                           opacity: 0.1,
                           color: DASHBOARD_ACCENT,
                           marginBottom: 16,
                        }}
                     />
                     <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                        {emptyMessage}
                     </Typography>
                     <Typography
                        variant="body2"
                        sx={{ color: DASHBOARD_TEXT_MUTED, mb: 3 }}
                     >
                        Try adjusting your filters or search criteria.
                     </Typography>
                     <Button
                        variant="contained"
                        onClick={onResetFilters}
                        sx={{
                           bgcolor: DASHBOARD_ACCENT,
                           "&:hover": { bgcolor: DASHBOARD_ACCENT + "e6" },
                           textTransform: "none",
                        }}
                     >
                        Clear All Filters
                     </Button>
                  </Paper>
               )}
         </Box>
      </Box>
   );
}
