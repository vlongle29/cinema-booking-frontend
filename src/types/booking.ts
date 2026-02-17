// src/types/booking.ts
export type SeatStatus = "available" | "selected" | "occupied";

export interface CheckoutState {
   seats: string[];
   timing: string;
   totalPrice: number;
}
