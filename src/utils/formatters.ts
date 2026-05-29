/**
 * Định dạng chuỗi ngày tháng ISO sang định dạng Việt Nam (DD/MM/YYYY)
 */
export const formatDate = (dateString: string | undefined | null): string => {
   if (!dateString) return "-";
   try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("vi-VN", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
      }).format(date);
   } catch (error) {
      return "-";
   }
};

/**
 * Định dạng chuỗi ngày tháng ISO sang định dạng đầy đủ (DD/MM/YYYY HH:mm)
 */
export const formatDateTime = (
   dateString: string | undefined | null,
): string => {
   if (!dateString) return "-";
   try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("vi-VN", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      }).format(date);
   } catch (error) {
      return "-";
   }
};

/**
 * Định dạng số điện thoại (VD: 0987654321 -> 0987 654 321)
 */
export const formatPhoneNumber = (phone: string | undefined | null): string => {
   if (!phone) return "-";
   const cleaned = ("" + phone).replace(/\D/g, "");
   const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
   if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
   }
   // Trường hợp số điện thoại bàn hoặc định dạng khác
   if (cleaned.length === 11) {
      return cleaned.replace(/(\d{4})(\d{4})(\d{3})/, "$1 $2 $3");
   }
   return phone;
};

export const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
   }).format(amount);
};

export const formatTime = (seconds: number) => {
   const m = Math.floor(seconds / 60);
   const s = seconds % 60;
   return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

/**
 * Định dạng thời lượng phim (VD: 125 phút -> 2h 5m)
 */
export const formatDuration = (duration: number) => {
   const hours = Math.floor(duration / 60);
   const minutes = duration % 60;

   if (hours && minutes) return `${hours}h ${minutes}m`;
   if (hours) return `${hours}h`;
   return `${minutes}m`;
};
