import { useState, useEffect } from "react";
import { sysPermissionService } from "@/features/dashboard/services/dashboard.rbac.service";
import type { SysPermission, SysPermissionRequest } from "@/types/rbac";
import toast from "react-hot-toast";

interface PermissionFormProps {
  initialData?: SysPermission | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const MODULE_OPTIONS = [
  { value: "city", label: "Thành phố" },
  { value: "branch", label: "Chi nhánh" },
  { value: "room", label: "Phòng chiếu" },
  { value: "movie", label: "Phim" },
  { value: "showtime", label: "Suất chiếu" },
  { value: "customer", label: "Khách hàng" },
  { value: "employee", label: "Nhân viên" },
  { value: "ticket", label: "Vé đặt" },
  { value: "promotion", label: "Khuyến mãi" },
  { value: "payment", label: "Thanh toán" },
  { value: "review", label: "Đánh giá" },
  { value: "role", label: "Vai trò & Phân quyền" },
  { value: "statistic", label: "Thống kê" },
];

const ACTION_OPTIONS = [
  { value: "view", label: "Xem" },
  { value: "create", label: "Tạo mới" },
  { value: "update", label: "Cập nhật" },
  { value: "delete", label: "Xóa" },
  { value: "manage", label: "Quản lý toàn quyền" },
  { value: "export", label: "Xuất dữ liệu" },
  { value: "refund", label: "Hoàn tiền" },
];

export default function PermissionForm({
  initialData,
  onCancel,
  onSuccess,
}: PermissionFormProps) {
  const isEditing = !!initialData;

  const [selectedModule, setSelectedModule] = useState("city");
  const [selectedAction, setSelectedAction] = useState("create");

  const [form, setForm] = useState<SysPermissionRequest>({
    permission: "",
    code: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Parse initialData when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        permission: initialData.permission,
        code: initialData.code ?? "",
        description: initialData.description ?? "",
      });

      if (initialData.permission.includes(":")) {
        const [mod, act] = initialData.permission.split(":");
        if (MODULE_OPTIONS.some((m) => m.value === mod)) setSelectedModule(mod);
        if (ACTION_OPTIONS.some((a) => a.value === act)) setSelectedAction(act);
      }
    } else {
      setSelectedModule("city");
      setSelectedAction("create");
    }
  }, [initialData]);

  // Sync form state whenever dropdown selection changes
  useEffect(() => {
    const moduleObj = MODULE_OPTIONS.find((m) => m.value === selectedModule);
    const actionObj = ACTION_OPTIONS.find((a) => a.value === selectedAction);

    const modLabel = moduleObj?.label || selectedModule;
    const actLabel = actionObj?.label || selectedAction;

    const permStr = `${selectedModule}:${selectedAction}`;
    const codeStr = `${selectedModule.toUpperCase()}_${selectedAction.toUpperCase()}`;
    const defaultDesc = `${actLabel} ${modLabel}`;

    setForm((prev) => ({
      ...prev,
      permission: permStr,
      code: codeStr,
      description: prev.description && isEditing ? prev.description : defaultDesc,
    }));
  }, [selectedModule, selectedAction, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const selectClass =
    "w-full bg-[#1e1e22] border border-[#393939] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f84565] transition-colors cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Friendly Select Module */}
      <div>
        <label className="block text-xs font-semibold text-[#797b7d] uppercase tracking-wider mb-1.5">
          1. Chọn Danh mục / Phân vùng <span className="text-rose-500">*</span>
        </label>
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className={selectClass}
        >
          {MODULE_OPTIONS.map((m) => (
            <option key={m.value} value={m.value} className="bg-[#1e1e22] text-white">
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Friendly Select Action */}
      <div>
        <label className="block text-xs font-semibold text-[#797b7d] uppercase tracking-wider mb-1.5">
          2. Chọn Thao tác / Hành động <span className="text-rose-500">*</span>
        </label>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className={selectClass}
        >
          {ACTION_OPTIONS.map((a) => (
            <option key={a.value} value={a.value} className="bg-[#1e1e22] text-white">
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-[#797b7d] uppercase tracking-wider mb-1.5">
          3. Ghi chú mô tả
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Mô tả ngắn về quyền này..."
          className="w-full bg-[#1e1e22] border border-[#393939] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#f84565] transition-colors resize-none"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-2 border-t border-[#2a2a2e]">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-[#d1d5dc] bg-transparent border border-[#393939] rounded-md hover:bg-white/5 transition-colors cursor-pointer"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#f84565] rounded-md hover:bg-[#d63352] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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

