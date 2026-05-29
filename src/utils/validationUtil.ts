import { z } from "zod";

export const userSchema = z.object({
   username: z
      .string()
      .min(3, "Tên đăng nhập ít nhất 3 ký tự")
      .max(100)
      .regex(/^[a-zA-Z0-9._]+$/, "Chỉ chứa chữ cái, số, dấu chấm và gạch dưới"),
   password: z
      .string()
      .min(8, "Mật khẩu ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Cần ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Cần ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Cần ít nhất 1 số")
      .regex(/[^A-Za-z0-9]/, "Cần ít nhất 1 ký tự đặc biệt")
      .optional()
      .or(z.literal("")),
   name: z.string().min(2, "Họ tên quá ngắn").max(100),
   email: z.string().email("Email không hợp lệ").max(100),
   phone: z
      .string()
      .regex(
         /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
         "Số điện thoại Việt Nam không hợp lệ",
      ),
   avatar: z.string().optional(),
   branchId: z.string().min(1, "Vui lòng chọn chi nhánh"),
   roleIds: z.array(z.string()).min(1, "Chọn ít nhất 1 vai trò"),
});

export type UserFormValues = z.infer<typeof userSchema>;
