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
   type SelectChangeEvent
} from "@mui/material";
import {
   Plus,
   X,
   Filter,
   RefreshCw,
   Search as SearchIcon,
   ChevronLeft,
   ChevronRight
} from "lucide-react";

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
   emptyMessage = "No matching items found.",
   loadingMessage = "Searching items..."
}: DashboardEntityListProps<T>) {

   const handleFilterChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | { name?: string; value: unknown }>
      | SelectChangeEvent<any>
   ) => {
      const { name, value } = e.target;
      if (name) {
         onSearchChange(name, value);
      }
   };

   return (
      <Box sx={{ width: "100%" }}>
         {/* --- Header --- */}
         <Box sx={{ mb: 4, mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: "white" }}>
               {isCreating ? "Create " : "List "}
               <Box component="span" sx={{ textDecoration: "underline", textDecorationColor: DASHBOARD_ACCENT, color: DASHBOARD_ACCENT }}>
                  {title}
               </Box>
            </Typography>

            {!isCreating ? (
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
                     px: 3
                  }}
               >
                  Add {title}
               </Button>
            ) : (
               <Button
                  variant="text"
                  startIcon={<X size={16} />}
                  onClick={onToggleCreating}
                  sx={{ color: DASHBOARD_TEXT_MUTED, "&:hover": { color: "white" }, textTransform: "none" }}
               >
                  Cancel
               </Button>
            )}
         </Box>

         {isCreating ? (
            <Box sx={{ 
               bgcolor: "rgba(248, 69, 101, 0.05)", 
               border: `1px solid rgba(248, 69, 101, 0.2)`, 
               borderRadius: 2,
               p: 4,
               width: "100%"
            }}>
               {renderCreateForm()}
            </Box>
         ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
               {/* --- Filters --- */}
               <Paper 
                  elevation={0}
                  sx={{ 
                     p: 3, 
                     bgcolor: DASHBOARD_BG, 
                     border: `1px solid ${DASHBOARD_BORDER}`, 
                     borderRadius: 2 
                  }}
               >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                     <Filter size={16} color={DASHBOARD_ACCENT} />
                     <Typography sx={{ color: "white", fontWeight: 600, fontSize: "0.875rem" }}>
                        Search Filters
                     </Typography>
                  </Box>

                  <Grid container spacing={2}>
                     {filters.map((filter) => (
                        <Grid item xs={12} sm={6} md={3} lg={2} key={filter.name}>
                           <Typography 
                              variant="caption" 
                              sx={{ 
                                 display: "block", 
                                 mb: 0.5, 
                                 color: DASHBOARD_TEXT_MUTED, 
                                 textTransform: "uppercase", 
                                 fontWeight: 700, 
                                 letterSpacing: 1 
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
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: DASHBOARD_BORDER },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: DASHBOARD_ACCENT },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: DASHBOARD_ACCENT },
                                    fontSize: "0.75rem",
                                    borderRadius: 1.5
                                 }}
                              >
                                 <MenuItem value="">{filter.placeholder || `All ${filter.label}s`}</MenuItem>
                                 {filter.options?.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
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
                                 inputProps={{ sx: { color: "white", fontSize: "0.75rem", p: "8.5px 14px", colorScheme: "dark" } }}
                                 sx={{
                                    bgcolor: "#252529",
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: DASHBOARD_BORDER },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: DASHBOARD_ACCENT },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: DASHBOARD_ACCENT },
                                    borderRadius: 1.5,
                                    "& input::-webkit-calendar-picker-indicator": { filter: "invert(1)" }
                                 }}
                              />
                           )}
                        </Grid>
                     ))}
                  </Grid>

                  <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${DASHBOARD_BORDER}`, display: "flex", justifyContent: "flex-end" }}>
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
                           "&:hover": { bgcolor: "#252529", borderColor: DASHBOARD_BORDER },
                           borderRadius: 1.5
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
                        borderRadius: 2
                     }}
                  >
                     <CircularProgress size={40} sx={{ color: DASHBOARD_ACCENT, mb: 2 }} />
                     <Typography variant="body2" sx={{ color: DASHBOARD_TEXT_MUTED }}>
                        {loadingMessage}
                     </Typography>
                  </Paper>
               ) : data.length > 0 ? (
                  <Paper
                     elevation={0}
                     sx={{
                        bgcolor: DASHBOARD_BG,
                        border: `1px solid ${DASHBOARD_BORDER}`,
                        borderRadius: 2,
                        overflow: "hidden"
                     }}
                  >
                     <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                           <TableHead sx={{ bgcolor: "#252529" }}>
                              <TableRow>
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
                                          py: 2
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
                                       "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                                       "& .MuiTableCell-root": { borderBottom: `1px solid ${DASHBOARD_BORDER}`, px: 3, py: 2 }
                                    }}
                                 >
                                    {columns.map((col) => (
                                       <TableCell key={col.id} align={col.align}>
                                          {col.render ? col.render(item) : (item as any)[col.id]}
                                       </TableCell>
                                    ))}
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>

                     {/* Pagination */}
                     <Box 
                        sx={{ 
                           p: 2, 
                           bgcolor: "#252529", 
                           borderTop: `1px solid ${DASHBOARD_BORDER}`, 
                           display: "flex", 
                           alignItems: "center", 
                           justifyContent: "space-between" 
                        }}
                     >
                        <Typography variant="caption" sx={{ color: DASHBOARD_TEXT_MUTED }}>
                           Found <Box component="span" sx={{ color: "white", fontWeight: 700 }}>{pagination.totalElements}</Box> {entityName}s
                        </Typography>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                           <Typography variant="caption" sx={{ color: DASHBOARD_TEXT_MUTED }}>
                              Page <Box component="span" sx={{ color: "white", fontWeight: 700 }}>{pagination.currentPage}</Box> of <Box component="span" sx={{ color: "white", fontWeight: 700 }}>{pagination.totalPages}</Box>
                           </Typography>
                           
                           <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton
                                 size="small"
                                 disabled={pagination.currentPage <= 1 || isLoading}
                                 onClick={() => onPageChange(pagination.currentPage - 1)}
                                 sx={{ 
                                    bgcolor: DASHBOARD_BG, 
                                    color: "white", 
                                    border: `1px solid ${DASHBOARD_BORDER}`,
                                    borderRadius: 1.5,
                                    "&:hover": { bgcolor: "#2d2d33" },
                                    "&.Mui-disabled": { opacity: 0.3 }
                                 }}
                              >
                                 <ChevronLeft size={16} />
                              </IconButton>
                              <IconButton
                                 size="small"
                                 disabled={pagination.currentPage >= pagination.totalPages || isLoading}
                                 onClick={() => onPageChange(pagination.currentPage + 1)}
                                 sx={{ 
                                    bgcolor: DASHBOARD_BG, 
                                    color: "white", 
                                    border: `1px solid ${DASHBOARD_BORDER}`,
                                    borderRadius: 1.5,
                                    "&:hover": { bgcolor: "#2d2d33" },
                                    "&.Mui-disabled": { opacity: 0.3 }
                                 }}
                              >
                                 <ChevronRight size={16} />
                              </IconButton>
                           </Box>
                        </Box>
                     </Box>
                  </Paper>
               ) : (
                  <Paper
                     elevation={0}
                     sx={{ 
                        p: 12, 
                        textAlign: "center",
                        bgcolor: DASHBOARD_BG,
                        border: `1px solid ${DASHBOARD_BORDER}`,
                        borderRadius: 2
                     }}
                  >
                     <SearchIcon size={64} style={{ opacity: 0.1, color: DASHBOARD_ACCENT, marginBottom: 16 }} />
                     <Typography variant="h6" sx={{ color: "white", mb: 1 }}>{emptyMessage}</Typography>
                     <Typography variant="body2" sx={{ color: DASHBOARD_TEXT_MUTED, mb: 3 }}>
                        Try adjusting your filters or search criteria.
                     </Typography>
                     <Button
                        variant="contained"
                        onClick={onResetFilters}
                        sx={{ bgcolor: DASHBOARD_ACCENT, "&:hover": { bgcolor: DASHBOARD_ACCENT + "e6" }, textTransform: "none" }}
                     >
                        Clear All Filters
                     </Button>
                  </Paper>
               )}
            </Box>
         )}
      </Box>
   );
}
