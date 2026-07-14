import { useState, useEffect } from "react";
import { sysPermissionService } from "@/features/dashboard/services/dashboard.rbac.service";
import type { SysPermission, SysPermissionRequest } from "@/types/rbac";
import toast from "react-hot-toast";

interface PermissionFormProps {
  initialData?: SysPermission | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function PermissionForm({
  initialData,
  onCancel,
  onSuccess,
}: PermissionFormProps) {
  const isEditing = !!initialData;

  const [form, setForm] = useState<SysPermissionRequest>({
    permission: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        permission: initialData.permission,
        description: initialData.description ?? "",
      });
    } else {
      setForm({ permission: "", description: "" });
    }
  }, [initialData]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.permission.trim()) errs.permission = "Tên quyền không được để trống";
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
        await sysPermissionService.update(form);
        toast.success("Cập nhật quyền thành công");
      } else {
        await sysPermissionService.create(form);
        toast.success("Tạo quyền thành công");
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
      {/* Permission name */}
      <div>
        <label className="block text-xs font-semibold text-[#797b7d] uppercase tracking-wider mb-1.5">
          Tên quyền (Permission) <span className="text-rose-500">*</span>
        </label>
        <input
          name="permission"
          value={form.permission}
          onChange={handleChange}
          placeholder="VD: role:view, movie:create..."
          className={inputClass("permission")}
          disabled={isEditing}
        />
        {isEditing && (
          <p className="text-[#555] text-xs mt-1">
            Tên quyền không thể chỉnh sửa sau khi tạo.
          </p>
        )}
        {errors.permission && (
          <p className="text-rose-400 text-xs mt-1">{errors.permission}</p>
        )}
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
          placeholder="Mô tả ngắn về quyền này..."
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
          {isSubmitting
            ? "Đang lưu..."
            : isEditing
              ? "Lưu thay đổi"
              : "Tạo quyền"}
        </button>
      </div>
    </form>
  );
}
