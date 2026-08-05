import { useState, useEffect } from "react";
import { Shield, Search, Check, Loader2 } from "lucide-react";
import type { SysRole, SysPermission } from "@/types/rbac";

interface AssignPermissionsPanelProps {
  role: SysRole | null;
  allPermissions: SysPermission[];
  currentPermissions: SysPermission[];
  isLoading: boolean;
  onSave: (permissionIds: string[]) => Promise<void>;
}

export default function AssignPermissionsPanel({
  role,
  allPermissions,
  currentPermissions,
  isLoading,
  onSave,
}: AssignPermissionsPanelProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Prefill selected from currentPermissions whenever role changes
  useEffect(() => {
    if (role) {
      setSelected(new Set(currentPermissions.map((p) => p.id)));
      setSearch("");
    }
  }, [role, currentPermissions]);

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-[#1a1a1e] border border-[#393939] rounded-2xl p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Shield size={32} className="text-[#555]" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Chưa chọn vai trò</h3>
        <p className="text-sm text-[#797b7d] max-w-sm">
          Vui lòng chọn một vai trò từ danh sách bên trái hoặc nhấn nút "Phân quyền" để bắt đầu gán quyền hạn.
        </p>
      </div>
    );
  }

  const filteredPermissions = allPermissions.filter((p) =>
    p.permission.toLowerCase().includes(search.toLowerCase()) ||
    (p.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // Group by prefix
  const grouped = filteredPermissions.reduce<Record<string, SysPermission[]>>(
    (acc, p) => {
      const group = p.permission.includes(":") ? p.permission.split(":")[0] : "other";
      if (!acc[group]) acc[group] = [];
      acc[group].push(p);
      return acc;
    },
    {},
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleGroup = (perms: SysPermission[]) => {
    const allSelected = perms.every((p) => selected.has(p.id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) perms.forEach((p) => next.delete(p.id));
      else perms.forEach((p) => next.add(p.id));
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(Array.from(selected));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[600px] bg-[#131316] border border-[#393939] rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2e] bg-gradient-to-r from-[#1a1a1e] to-[#131316]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <Shield size={20} className="text-[#f84565]" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-base leading-none">
              Phân quyền vai trò
            </h2>
            <p className="text-[#797b7d] text-sm mt-1">
              {role.name} · {role.code}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col gap-4 p-6 overflow-hidden">
        {/* Stats bar */}
        <div className="flex items-center justify-between text-sm text-[#797b7d]">
          <span>
            Đã chọn{" "}
            <span className="text-[#f84565] font-semibold">{selected.size}</span>
            {" "}/ {allPermissions.length} quyền
          </span>
          <button
            onClick={() =>
              selected.size === allPermissions.length
                ? setSelected(new Set())
                : setSelected(new Set(allPermissions.map((p) => p.id)))
            }
            className="text-[#f84565] hover:underline font-medium"
          >
            {selected.size === allPermissions.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm quyền theo tên..."
            className="w-full bg-[#1e1e22] border border-[#393939] rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#f84565] transition-colors"
          />
        </div>

        {/* Permission list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full gap-2 text-[#797b7d]">
              <Loader2 size={24} className="animate-spin text-[#f84565]" />
              <span>Đang tải...</span>
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#555]">
              <p>Không tìm thấy quyền nào</p>
            </div>
          ) : (
            Object.entries(grouped).map(([group, perms]) => {
              const allGroupSelected = perms.every((p) => selected.has(p.id));
              const someGroupSelected = perms.some((p) => selected.has(p.id));
              return (
                <div key={group} className="border border-[#2a2a2e] rounded-xl overflow-hidden">
                  {/* Group header */}
                  <button
                    onClick={() => toggleGroup(perms)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a1e] hover:bg-[#252529] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          allGroupSelected
                            ? "bg-[#f84565] border-[#f84565]"
                            : someGroupSelected
                              ? "bg-[#f84565]/30 border-[#f84565]/50"
                              : "bg-transparent border-[#393939]"
                        }`}
                      >
                        {(allGroupSelected || someGroupSelected) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-[#f84565] uppercase tracking-wider">
                        {group}
                      </span>
                      <span className="text-xs text-[#555] font-medium">({perms.length})</span>
                    </div>
                    <span className="text-xs font-medium text-[#797b7d]">
                      {perms.filter((p) => selected.has(p.id)).length}/{perms.length}
                    </span>
                  </button>
                  {/* Permissions */}
                  <div className="divide-y divide-[#2a2a2e]">
                    {perms.map((perm) => (
                      <button
                        key={perm.id}
                        onClick={() => toggle(perm.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-[#1a1a1e] hover:bg-[#252529] transition-colors text-left"
                      >
                        <div
                          className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                            selected.has(perm.id)
                              ? "bg-[#f84565] border-[#f84565]"
                              : ""
                          }`}
                        >
                          {selected.has(perm.id) && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-mono truncate">
                            {perm.permission}
                          </p>
                          {perm.description && (
                            <p className="text-xs text-[#797b7d] truncate mt-0.5">
                              {perm.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#2a2a2e] bg-[#1a1a1e]">
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-[#f84565] rounded-lg hover:bg-[#d63352] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-rose-500/20"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          {isSaving ? "Đang lưu..." : "Lưu phân quyền"}
        </button>
      </div>
    </div>
  );
}
