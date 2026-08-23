# CineBook Independent Frontend Application

Dự án Frontend độc lập của hệ thống đặt vé xem phim CineBook được xây dựng bằng **React 19**, **TypeScript**, **Vite**, **Tailwind CSS** và **Shadcn UI / Material UI**.

Dự án đã được tách hoàn toàn ra khỏi backend monolith nhưng vẫn đảm bảo **100% hợp đồng API (API Contracts)**, quy trình xác thực (Authentication Flow) và kết nối WebSocket thời gian thực với hệ thống Backend.

---

## 🛠️ Công Nghệ Sử Dụng

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons, Material UI
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios (với Interceptor tự động làm mới JWT Token qua Refresh Token Cookie)
- **State & Form**: React Hook Form, Zod validation
- **Real-time**: Native WebSocket / SockJS client hook (`useBookingWebSocket`)

---

## ⚙️ Cấu Hình Biến Môi Trường (Environment Variables)

Ứng dụng không hard-code bất kỳ URL API backend nào. Tất cả các kết nối REST API và WebSocket đều được cấu hình linh hoạt thông qua biến môi trường.

Tạo file `.env` từ mẫu `.env.example`:

```env
# REST API Base URL (Bao gồm tiền tố /api)
VITE_API_URL=http://localhost:8080/api

# Backend Base Domain URL (Không bao gồm /api, dùng cho static assets & auth redirects)
VITE_API_BASE_URL=http://localhost:8080

# WebSocket URL cho luồng giữ ghế theo thời gian thực
VITE_WS_URL=ws://localhost:8080/ws/booking
```

---

## 🔑 Quy Trình Xác Thực & Kết Nối Backend

1. **Authentication Flow**:
   - `accessToken` (JWT) được lưu trữ trong bộ nhớ và tự động gắn vào Header `Authorization: Bearer <token>` thông qua Axios Interceptor (`src/api/axiosInstance.ts`).
   - `sessionId` và `refreshToken` được lưu dưới dạng `HttpOnly Cookie`. Mọi request gọi đi đều thiết lập `withCredentials: true` để trình duyệt tự động gửi cookie an toàn.
   - Khi nhận mã phản hồi HTTP `401 Unauthorized`, Axios Interceptor sẽ tự động gọi endpoint `/auth/refresh-token` để lấy `accessToken` mới mà không ngắt đoạn trải nghiệm người dùng.

2. **API Endpoint Contracts**:
   - Tất cả các service (`src/services/*`) giữ nguyên 100% path, HTTP method, request body, query parameters và response format chuẩn của Backend.

3. **WebSocket**:
   - `useBookingWebSocket.ts` tự động đọc URL từ `import.meta.env.VITE_WS_URL` để thiết lập kết nối thời gian thực cho sơ đồ chọn ghế.

---

## 🚀 Hướng Dẫn Chạy Dự Án

### 1. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### 2. Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ chạy mặc định tại: `http://localhost:5173`

### 3. Kiểm tra TypeScript & Đóng gói sản xuất (Build)
```bash
npm run build
```
Sản phẩm đóng gói sẽ nằm trong thư mục `/dist`.

### 4. Xem trước bản build sản xuất (Preview Build)
```bash
npm run preview
```

---

## 📁 Cấu Trúc Thư Mục Chính

```text
cine-book-app/
├── public/                # Tài nguyên tĩnh
├── src/
│   ├── api/               # Axios Instance & interceptors (VITE_API_URL)
│   ├── components/        # UI components dùng chung (Button, Dialog, Seat, ...)
│   ├── constants/         # Các hằng số API & mock data (đọc từ import.meta.env)
│   ├── context/           # React Context (AuthContext)
│   ├── features/          # Các module chức năng (auth, movie, showtime, seat-selection, dashboard)
│   ├── hooks/             # Custom React Hooks (useBookingWebSocket, useDebounce, ...)
│   ├── pages/             # Các trang (HomePage, SeatSelectPage, ProfilePage, ...)
│   ├── services/          # API Services (user, movie, employee, booking, ...)
│   ├── types/             # TypeScript definitions & interfaces
│   └── utils/             # các hàm tiện ích (seatUtils, currency formatting, ...)
├── .env                   # Cấu hình môi trường phát triển cục bộ
├── .env.example           # File mẫu hướng dẫn biến môi trường
├── package.json           # Danh sách gói phụ thuộc và scripts
├── tsconfig.json          # Cấu hình TypeScript
└── vite.config.ts         # Cấu hình Vite bundler & alias `@`
```
