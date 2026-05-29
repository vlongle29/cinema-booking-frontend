// paymentMethods.ts
export interface PaymentMethod {
   id: string;
   name: string;
   iconUrl: string; // Chỉ lưu URL ảnh thay vì component
   logo?: string;
}

export const paymentMethodsData: PaymentMethod[] = [
   {
      id: "atm",
      name: "ATM card (Thẻ nội địa)",
      iconUrl:
         "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/atm_icon.png",
   },
   {
      id: "international",
      name: "Thẻ quốc tế (Visa, Master, Amex, JCB)",
      iconUrl:
         "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/visamaster_logo.png",
   },
   {
      id: "momo",
      name: "MoMo",
      iconUrl:
         "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/momo_icon.png",
   },
   {
      id: "vnpay",
      name: "VNPAY",
      iconUrl:
         "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/vnpay_newlogo.png",
   },
   {
      id: "NCB",
      name: "NCB Bank",
      iconUrl:
         "https://www.ncb-bank.vn/cache-buster-1695119533/website/static/images/logo.png",
      logo: "https://upload.wikimedia.org/wikipedia/vi/thumb/4/4e/NCB_Bank_logo.png/640px-NCB_Bank_logo.png",
   },
];
