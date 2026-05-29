import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { branchService } from "@/services/branchService";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";

export default function BranchDetail() {
   const { id } = useParams<{ id: string }>();
   const [branch, setBranch] = useState<any>(null);
   const [rooms, setRooms] = useState<any[]>([]);
   const [tabValue, setTabValue] = useState(0);

   useEffect(() => {
      if (id) {
         branchService.getById(id).then((res) => setBranch(response.data));
         branchService
            .getRoomsByBranch(id)
            .then((res) => setRooms(response.data));
      }
   }, [id]);

   if (!branch) return <div className="p-8 text-white">Loading...</div>;

   return (
      <Box className="p-6 text-white space-y-6">
         <Typography variant="h4" className="font-bold text-rose-500">
            {branch.name}
         </Typography>

         <Paper className="bg-[#1a1a1e] border border-gray-800">
            <Tabs
               value={tabValue}
               onChange={(_, v) => setTabValue(v)}
               textColor="inherit"
               indicatorColor="primary"
            >
               <Tab label="Thông tin chung" />
               <Tab label="Danh sách phòng" />
            </Tabs>

            <Box className="p-6">
               {tabValue === 0 && (
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-gray-500">Địa chỉ:</p>
                        <p>{branch.address}</p>
                     </div>
                     <div>
                        <p className="text-gray-500">Người quản lý:</p>
                        <p>{branch.managerId || "N/A"}</p>
                     </div>
                  </div>
               )}
               {tabValue === 1 && (
                  <div className="space-y-2">
                     {rooms.map((room) => (
                        <div
                           key={room.id}
                           className="p-3 bg-white/5 rounded border border-white/10 flex justify-between"
                        >
                           <span>{room.name}</span>
                           <span className="text-gray-400">
                              {room.totalSeats} ghế
                           </span>
                        </div>
                     ))}
                  </div>
               )}
            </Box>
         </Paper>
      </Box>
   );
}
