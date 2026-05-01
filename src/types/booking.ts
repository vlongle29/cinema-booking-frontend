// src/types/booking.ts
export type SeatStatus = "available" | "selected" | "occupied";

export interface Seat {
   seatNumber: string;
   seatTypeId: string;
   rowIndex: number;
   colIndex: number;
   rowChar?: string; 
   status?: string;
   isAisle?: boolean;
}

export interface SeatType {
   id: string;
   name: string;
   color: string;
}

export interface CheckoutState {
   seats: string[];
   timing: string;
   totalPrice: number;
}
