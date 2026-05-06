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

export type BookingStatus =
   | "PENDING"
   | "CONFIRMED"
   | "CANCELLED"
   | "REFUNDED"
   | "PAID"
   | "EXPIRED"
   | string;

export interface Booking {
   id: string;
   customerId?: string | null;
   userId?: string | null;
   staffId?: string | null;
   showtimeId: string;
   bookingCode?: string;
   promotionId?: string | null;
   totalTicketPrice: number;
   totalFoodPrice: number;
   discountAmount: number;
   finalAmount: number;
   bookingDate: string;
   expiredAt?: string | null;
   status: BookingStatus;
   paymentMethod?: string | null;
   cancellationReason?: string | null;
   cancelledAt?: string | null;
   refundAmount?: number | null;
   refundDate?: string | null;
   refundReason?: string | null;
   refundTransactionNo?: string | null;
   // Các trường từ AuditingEntity (giả định dựa trên các type khác trong project)
   createTime?: string;
   updateTime?: string;
   createBy?: string;
   updateBy?: string;
}

export interface ProductItem {
   productId: string;
   quantity: number;
   priceAtPurchase: number;
}

/** Các phương thức thanh toán hỗ trợ */
export type PaymentMethod =
   | "CASH"
   | "CREDIT_CARD"
   | "E_WALLET"
   | "momo"
   | "zalopay"
   | "vnpay"
   | "NCB"
   | string;

export interface BookingCheckoutData {
   promotionId?: string;
   giftCardCode?: string;
   paymentMethod: PaymentMethod;
}

export interface BookingListItem {
   id: string;
   showtimeId: string;
   showtimeStartTime: string;
   movieTitle: string;
   moviePosterUrl: string;
   branchName: string;
   roomName: string;
   cityName: string;
   ticketCount: number;
   totalTicketPrice: number;
   totalFoodPrice: number;
   discountAmount: number;
   finalAmount: number;
   bookingDate: string;
   status: BookingStatus;
   paymentMethod: PaymentMethod | null;
}

export interface BookingSearchResponse {
   content: BookingListItem[];
   totalPages?: number;
   totalElements?: number;
   pageSize?: number;
   pageNumber?: number;
}
