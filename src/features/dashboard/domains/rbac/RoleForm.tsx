import { useState, useEffect } from "react";
import { sysRoleService } from "@/features/dashboard/services/dashboard.rbac.service";
import type { SysRole, SysRoleRequest } from "@/types/rbac";
import toast from "react-hot-toast";

interface RoleFormProps {
  initialData?: SysRole | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function RoleForm({ initialData, onCancel, onSuccess }: RoleFormProps) {
  const isEditing = !!initialData;

  const [form, setForm] = useState<SysRoleRequest>({
    name: "",
    code: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        name: initialData.name,
        code: initialData.code,
        description: initialData.description ?? "",
      });
    } else {
      setForm({ name: "", code: "", description: "" });
    }
  }, [initialData]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Tên vai trò không được để trống";
    if (!form.code.trim()) errs.code = "Mã vai trò không được để trống";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await sysRoleService.update(form);
        toast.success("Cập nhật vai trò thành công");
      } else {
        await sysRoleService.create(form);
        toast.success("Tạo vai trò thành công");
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-[#1e1e22] border ${
      errors[field] ? "border-rose-500" : "border-[#393939]"
    } rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#f84565] transition-colors`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-[#797b7d] uppercase tracking-wider mb-1.5">
          Tên vai trò <span className="text-rose-500">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="VD: Quản trị viên"
          className={inputClass("name")}
        />
        {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Code */}
      <div>
        <label className="block text-xs font-semibold text-[#797b7d] uppercase tracking-wider mb-1.5">
          Mã vai trò (Code) <span className="text-rose-500">*</span>
        </label>
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="VD: ROLE_ADMIN"
          className={inputClass("code")}
          disabled={isEditing}
        />
        {isEditing && (
          <p className="text-[#555] text-xs mt-1">Mã vai trò không thể chỉnh sửa sau khi tạo.</p>
        )}
        {errors.code && <p className="text-rose-400 text-xs mt-1">{errors.code}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-[#797b7d] uppercase tracking-wider mb-1.5">
          Mô tả
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Mô tả ngắn về vai trò này..."
          className="w-full bg-[#1e1e22] border border-[#393939] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#f84565] transition-colors resize-none"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-2 border-t border-[#2a2a2e]">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-[#d1d5dc] bg-transparent border border-[#393939] rounded-lg hover:bg-white/5 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#f84565] rounded-lg hover:bg-[#d63352] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo vai trò"}
        </button>
      </div>
    </form>
  );
}
