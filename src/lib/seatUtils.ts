import type { Seat } from "../types/booking";

/**
 * Convert the index corresponding letter (0 -> A, 1 -> B, ...)
 */
export const getRowChar = (index: number) => String.fromCharCode(65 + index); // 65 is the ASCII code of 'A'

/**
 * Generate one-dimensional matrix array (1D array)
 * Reason for using 1D array: Very easy to render with CSS Grid (grid-template-columns)
 */
export const generateSeats = (rows: number, cols: number, defaultSeatTypeId: string) => {
   const grid: Seat[] = [];
   for (let i = 0; i < rows; i++) {
      for (let j = 1; j <= cols; j++) {
         grid.push({
            seatNumber: `${getRowChar(i)}${j}`,
            seatTypeId: defaultSeatTypeId,
            isAisle: false,
         });
      }
   }
   return grid;
};

/**
 * Standard Vietnamese Dong currency format
 */
export const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
   }).format(amount);
};

/**
 * Count the number of each type of seat and the numbser of aisles
 * Used for the summary table when creating/editing templates.
 */
export const countSeatsByType = (seats: Seat[]) => {
   return seats.reduce((acc: Record<string, number>, seat: Seat) => {
      if (seat.isAisle) {
         acc['AISLE'] = (acc['AISLE'] || 0) + 1;
      } else {
         acc[seat.seatTypeId] = (acc[seat.seatTypeId] || 0) + 1;
      }
      return acc;
   }, { 'AISLE': 0 }); // Initialization default AISLE = 0
};
