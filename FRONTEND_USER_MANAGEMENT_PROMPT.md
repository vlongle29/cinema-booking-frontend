# PROMPT: Xây dựng Trang Quản Lý Người Dùng (User Management Dashboard)

## 🎯 Mục tiêu
Xây dựng trang quản lý người dùng/nhân viên trong dashboard admin sử dụng **ReactJS + TypeScript + Tailwind CSS**. Trang này cho phép CRUD người dùng, tìm kiếm, phân trang, khóa/mở khóa tài khoản, và gán vai trò.

---

## 📋 Yêu cầu Chức năng

### 1. Danh sách người dùng (User List)
- Hiển thị bảng danh sách người dùng với các cột:
  - **Avatar** (ảnh đại diện)
  - **Username** (tên đăng nhập)
  - **Name** (họ tên)
  - **Email**
  - **Phone** (số điện thoại)
  - **Roles** (vai trò - hiển thị dạng badges)
  - **Status** (trạng thái: Active/Locked - hiển thị badge màu xanh/đỏ)
  - **Actions** (các nút: Edit, Delete, Lock/Unlock)

### 2. Tìm kiếm và Lọc
- Form tìm kiếm với các trường:
  - Username (text input)
  - Email (text input)
  - Name (text input)
  - Phone (text input)
  - Lock Status (dropdown: All/Active/Locked)
  - Roles (multi-select dropdown)
- Nút "Search" và "Reset"

### 3. Phân trang
- Hiển thị phân trang với:
  - Số trang hiện tại / tổng số trang
  - Nút Previous/Next
  - Dropdown chọn số items per page (10, 20, 50, 100)
  - Tổng số records

### 4. Thêm người dùng mới (Create User)
- Modal/Form với các trường:
  - **Username*** (required)
  - **Password*** (required, có nút show/hide password)
  - **Name*** (required)
  - **Email*** (required, validate email format)
  - **Phone*** (required, validate phone format)
  - **Avatar** (optional, upload ảnh hoặc nhập URL)
  - **Branch*** (required, dropdown chọn chi nhánh)
  - **Roles*** (required, multi-select dropdown)
- Validation cho tất cả các trường required
- Nút "Create" và "Cancel"

### 5. Cập nhật người dùng (Update User)
- Modal/Form tương tự Create nhưng:
  - Pre-fill dữ liệu hiện tại
  - Password là optional (chỉ nhập nếu muốn đổi)
  - Có thêm trường Lock Status (toggle switch)
- Nút "Update" và "Cancel"

### 6. Xóa người dùng (Delete User)
- Xóa đơn lẻ: Modal xác nhận "Bạn có chắc muốn xóa người dùng này?"
- Xóa nhiều: Checkbox chọn nhiều user, nút "Delete Selected"
- Hiển thị số lượng user được chọn

### 7. Khóa/Mở khóa tài khoản
- Nút Lock/Unlock trên từng row
- Có thể chọn nhiều user và Lock/Unlock hàng loạt
- Modal xác nhận trước khi thực hiện

### 8. Reset mật khẩu
- Nút "Reset Password" trên từng user
- Gửi email reset password cho user
- Hiển thị thông báo thành công

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api/users
```

### 1. Tìm kiếm và phân trang
**POST** `/api/users/search`

**Request Body:**
```typescript
interface SysUserSearchDTO {
  username?: string;
  email?: string;
  name?: string;
  phone?: string;
  lockFlag?: 'LOCK' | 'UNLOCK'; // null = all
  roleIds?: string[]; // UUID[]
  ids?: string[]; // UUID[]
  pageNumber: number; // Bắt đầu từ 0
  pageSize: number;
  sortBy?: string; // Ví dụ: "name", "createTime"
  sortDirection?: 'ASC' | 'DESC';
}
```

**Response:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: string;
  status: number;
  data: T;
}

interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface UserInfoResponse {
  id: string; // UUID
  username: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  lockFlag: string; // "0" = Active, "1" = Locked
  systemFlag: string;
  roles: RoleInfo[];
}

interface RoleInfo {
  id: string; // UUID
  name: string;
  code: string;
}
```

### 2. Tạo người dùng mới
**POST** `/api/users`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```typescript
interface UserCreateRequest {
  username: string; // required
  password: string; // required
  name: string; // required
  email: string; // required
  phone: string; // required
  avatar?: string;
  systemFlag?: string;
  roleIds: string[]; // UUID[], required
  branchId: string; // UUID, required
}
```

**Response:**
```typescript
ApiResponse<UserInfoResponse>
```

### 3. Cập nhật người dùng
**PUT** `/api/users/{id}`

**Request Body:**
```typescript
interface UserUpdateRequest {
  username?: string;
  name?: string;
  password?: string; // Optional, chỉ gửi nếu muốn đổi
  email?: string;
  phone?: string;
  avatar?: string;
  lockFlag?: string; // "0" hoặc "1"
  systemFlag?: string;
  typeAccount?: string;
  roleIds?: string[]; // UUID[]
}
```

**Response:**
```typescript
ApiResponse<UserInfoResponse>
```

### 4. Lấy chi tiết người dùng
**GET** `/api/users/{id}`

**Response:**
```typescript
ApiResponse<UserInfoResponse>
```

### 5. Xóa người dùng (đơn hoặc nhiều)
**DELETE** `/api/users`

**Request Body:**
```typescript
interface UserIdRequest {
  ids: string[]; // UUID[]
}
```

**Response:**
```typescript
ApiResponse<void>
```

### 6. Khóa người dùng
**POST** `/api/users/lock`

**Request Body:**
```typescript
interface UserIdRequest {
  ids: string[]; // UUID[]
}
```

**Response:**
```typescript
ApiResponse<number> // Số lượng user đã khóa
```

### 7. Mở khóa người dùng
**POST** `/api/users/unlock`

**Request Body:**
```typescript
interface UserIdRequest {
  ids: string[]; // UUID[]
}
```

**Response:**
```typescript
ApiResponse<number> // Số lượng user đã mở khóa
```

### 8. Reset mật khẩu qua email
**POST** `/api/users/reset-password-user`

**Request Body:**
```typescript
interface UserResetPasswordRequest {
  email: string;
}
```

**Response:**
```typescript
ApiResponse<void>
```

### 9. Lấy danh sách tất cả vai trò (cho dropdown)
**GET** `/api/roles`

**Response:**
```typescript
interface SysRoleResponse {
  id: string; // UUID
  code: string;
  name: string;
  description: string;
  createTime: string; // ISO date
  updateTime: string; // ISO date
  updateBy: string; // UUID
}

ApiResponse<SysRoleResponse[]>
```

---

## 🎨 Yêu cầu UI/UX

### Design System
- Sử dụng **Tailwind CSS** cho styling
- Màu sắc:
  - Primary: Blue (#3B82F6)
  - Success: Green (#10B981)
  - Danger: Red (#EF4444)
  - Warning: Yellow (#F59E0B)
  - Gray: (#6B7280)
- Font: Inter hoặc system font

### Components cần có
1. **UserTable**: Bảng danh sách user với sorting, selection
2. **UserSearchForm**: Form tìm kiếm với các filters
3. **UserModal**: Modal cho Create/Edit user
4. **ConfirmDialog**: Dialog xác nhận cho Delete/Lock/Unlock
5. **Pagination**: Component phân trang
6. **StatusBadge**: Badge hiển thị trạng thái (Active/Locked)
7. **RoleBadge**: Badge hiển thị vai trò
8. **AvatarUpload**: Component upload/preview avatar

### Responsive
- Desktop: Hiển thị đầy đủ bảng
- Tablet: Ẩn một số cột ít quan trọng
- Mobile: Chuyển sang card view thay vì table

### Loading States
- Skeleton loading cho table khi đang fetch data
- Spinner cho các actions (Create, Update, Delete)
- Disable buttons khi đang xử lý

### Error Handling
- Hiển thị toast/notification cho success/error messages
- Validation errors hiển thị dưới từng input field
- Network error: Hiển thị retry button

---

## 📁 Cấu trúc Thư mục Đề xuất

```
src/
├── pages/
│   └── dashboard/
│       └── users/
│           ├── index.tsx              # Main page
│           ├── UserTable.tsx          # Table component
│           ├── UserSearchForm.tsx     # Search form
│           ├── UserModal.tsx          # Create/Edit modal
│           └── components/
│               ├── StatusBadge.tsx
│               ├── RoleBadge.tsx
│               └── AvatarUpload.tsx
├── services/
│   ├── api/
│   │   ├── userApi.ts                 # User API calls
│   │   └── roleApi.ts                 # Role API calls
│   └── types/
│       ├── user.types.ts              # User interfaces
│       ├── role.types.ts              # Role interfaces
│       └── api.types.ts               # Common API types
├── hooks/
│   ├── useUsers.ts                    # Custom hook for user operations
│   └── useRoles.ts                    # Custom hook for roles
├── utils/
│   ├── validation.ts                  # Validation helpers
│   └── formatters.ts                  # Format helpers
└── components/
    └── common/
        ├── Pagination.tsx
        ├── ConfirmDialog.tsx
        └── Toast.tsx
```

---

## 🔧 Technical Requirements

### Dependencies cần cài đặt
```bash
npm install axios react-query @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install react-hot-toast # hoặc react-toastify
npm install @headlessui/react # cho Modal, Dialog
npm install @heroicons/react # cho icons
npm install clsx tailwind-merge # cho className utilities
```

### State Management
- Sử dụng **React Query** (TanStack Query) cho server state
- Sử dụng **React Hook Form** cho form state
- Sử dụng **Zod** cho validation schema

### Authentication
- Lưu JWT token trong localStorage hoặc httpOnly cookie
- Thêm token vào header của mọi request:
  ```typescript
  headers: {
    'Authorization': `Bearer ${token}`
  }
  ```
- Redirect về login page nếu token expired (401)

### Error Handling Pattern
```typescript
try {
  const response = await userApi.createUser(data);
  if (response.success) {
    toast.success(response.message);
    // Refresh data
  }
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || 'Có lỗi xảy ra';
    toast.error(message);
  }
}
```

---

## ✅ Validation Rules

### Username
- Required
- Min length: 3
- Max length: 100
- Pattern: Chỉ chữ cái, số, underscore, dấu chấm

### Password
- Required (khi tạo mới)
- Min length: 8
- Phải có ít nhất: 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt

### Email
- Required
- Valid email format
- Max length: 100

### Phone
- Required
- Pattern: Số điện thoại Việt Nam (10-11 số, bắt đầu bằng 0)

### Name
- Required
- Min length: 2
- Max length: 100

---

## 🎯 User Stories

### Admin muốn xem danh sách người dùng
1. Vào trang User Management
2. Thấy bảng danh sách user với đầy đủ thông tin
3. Có thể sort theo các cột
4. Có thể chuyển trang

### Admin muốn tìm kiếm user
1. Nhập thông tin vào form tìm kiếm
2. Click "Search"
3. Bảng hiển thị kết quả phù hợp
4. Có thể reset filter

### Admin muốn tạo user mới
1. Click nút "Add User"
2. Modal hiện ra với form
3. Điền thông tin, chọn roles
4. Click "Create"
5. Thấy thông báo thành công
6. User mới xuất hiện trong danh sách

### Admin muốn khóa tài khoản user
1. Chọn 1 hoặc nhiều user
2. Click nút "Lock"
3. Xác nhận trong dialog
4. Thấy status chuyển sang "Locked"

### Admin muốn reset password cho user
1. Click nút "Reset Password" trên user
2. Xác nhận
3. Email reset password được gửi
4. Thấy thông báo thành công

---

## 🚀 Bonus Features (Optional)

1. **Export to Excel**: Xuất danh sách user ra file Excel
2. **Import Users**: Import nhiều user từ file CSV/Excel
3. **Activity Log**: Xem lịch sử hoạt động của user
4. **Advanced Filters**: Lọc theo ngày tạo, ngày cập nhật
5. **Bulk Actions**: Gán role hàng loạt, đổi branch hàng loạt
6. **User Profile Preview**: Hover vào avatar để xem quick info
7. **Dark Mode**: Hỗ trợ dark mode

---

## 📝 Notes

- Tất cả các API đều trả về cấu trúc `ApiResponse<T>`
- UUID được sử dụng cho tất cả các ID
- `lockFlag`: "0" = Active, "1" = Locked
- `systemFlag`: "1" = System user, "0" = Normal user
- Phân trang bắt đầu từ 0 (pageNumber: 0 = trang đầu tiên)
- Cần xử lý trường hợp user không có avatar (hiển thị avatar mặc định)
- Roles hiển thị dạng badges với màu khác nhau
- Cần confirm trước khi thực hiện các action nguy hiểm (Delete, Lock)

---

## 🎨 UI Reference (Gợi ý)

Tham khảo các design pattern từ:
- **Ant Design**: Table, Modal, Form components
- **Material-UI**: Data Grid, Dialog
- **Tailwind UI**: Dashboard layouts
- **Shadcn/ui**: Modern component library

---

## 🔐 Security Notes

- Chỉ SUPER_ADMIN và ADMIN mới có quyền tạo user mới
- Validate dữ liệu ở cả frontend và backend
- Không hiển thị password trong bất kỳ response nào
- Sanitize input để tránh XSS
- Rate limiting cho các API endpoints

---

**Chúc bạn code vui vẻ! 🚀**
