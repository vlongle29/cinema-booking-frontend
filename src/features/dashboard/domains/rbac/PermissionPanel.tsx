import { useState, useMemo, useCallback } from "react";
import {
  Key, Plus, Trash2, Edit2, Search, RefreshCw,
  ChevronDown, ChevronRight, Loader2, ShieldCheck,
} from "lucide-react";
import type { SysPermission } from "@/types/rbac";
import PermissionForm from "./PermissionForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ─── helpers ────────────────────────────────────────────────────────────────

const BADGE_BASE = "bg-[#1e1e22] text-[#d1d5dc] border-[#393939]";

const GROUP_TRANSLATION: Record<string, string> = {
  city: "Thành phố",
  genre: "Thể loại",
  customer: "Khách hàng",
  employee: "Nhân viên",
  payment: "Thanh toán",
  movie: "Phim",
  room: "Phòng chiếu",
  showtime: "Suất chiếu",
  ticket: "Vé",
  promotion: "Khuyến mãi",
  review: "Đánh giá",
  branch: "Chi nhánh",
  position: "Chức vụ",
  permission: "Quyền hạn",
  role: "Vai trò",
  dashboard: "Bảng điều khiển",
  user: "Người dùng",
  booking: "Đặt vé",
  seat: "Ghế ngồi",
  statistic: "Thống kê",
  report: "Báo cáo",
  auth: "Xác thực",
  other: "Khác",
};

const ACTION_TRANSLATION: Record<string, string> = {
  view: "Xem",
  read: "Xem",
  list: "Xem danh sách",
  create: "Tạo mới",
  add: "Thêm mới",
  update: "Cập nhật",
  edit: "Chỉnh sửa",
  delete: "Xóa",
  remove: "Xóa",
  manage: "Quản lý",
  export: "Xuất dữ liệu",
  import: "Nhập dữ liệu",
  refund: "Hoàn tiền",
  cancel: "Hủy",
  search: "Tìm kiếm",
  assign: "Phân quyền",
  transfer: "Điều chuyển",
  lock: "Khóa",
  unlock: "Mở khóa",
  deactivate: "Vô hiệu hóa",
  activate: "Kích hoạt",
  report: "Báo cáo",
  stats: "Thống kê",
  statistic: "Thống kê",
};

function getActionColor(_action: string) {
  return BADGE_BASE;
}

function translateGroup(group: string) {
  const lower = group.toLowerCase();
  return GROUP_TRANSLATION[lower] || group;
}

function translateAction(action: string) {
  const lower = action.toLowerCase();
  return ACTION_TRANSLATION[lower] || action;
}

function groupPermissions(perms: SysPermission[]) {
  return perms.reduce<Record<string, SysPermission[]>>((acc, p) => {
    const group = p.permission.includes(":") ? p.permission.split(":")[0] : "other";
    (acc[group] ??= []).push(p);
    return acc;
  }, {});
}

// ─── sub-component: single group card ───────────────────────────────────────

interface GroupCardProps {
  group: string;
  perms: SysPermission[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleGroup: (perms: SysPermission[]) => void;
  onEdit: (perm: SysPermission) => void;
  onDelete: (id: string) => void;
}

function GroupCard({
  group, perms, selectedIds, onToggleSelect, onToggleGroup, onEdit, onDelete,
}: GroupCardProps) {
  const [expanded, setExpanded] = useState(true);
  const allSelected = perms.length > 0 && perms.every((p) => selectedIds.has(p.id));
  const someSelected = perms.some((p) => selectedIds.has(p.id));

  return (
    <div className="border border-[#2e2e34] rounded-xl overflow-hidden bg-[#16161a]">
      {/* Card header */}
      <div 
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between px-4 py-2.5 bg-[#202025] hover:bg-[#25252b] border-b border-[#2e2e34] transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          {/* Group checkbox */}
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected && !allSelected;
            }}
            onChange={(e) => {
              e.stopPropagation();
              onToggleGroup(perms);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4.5 h-4.5 rounded border-[#393939] bg-[#252529] text-[#f84565] accent-[#f84565] focus:ring-[#f84565] cursor-pointer"
          />

          {/* Icon + name */}
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={17} className="text-[#f84565]" />
            <span className="font-bold text-white text-sm uppercase tracking-wider">
              {translateGroup(group)}
            </span>
            <span className="text-xs font-semibold text-zinc-400 bg-[#2b2b32] px-2 py-0.5 rounded border border-white/5">
              {perms.length}
            </span>
          </div>
        </div>

        {/* Expand toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">
            {expanded ? "Thu gọn" : "Mở rộng"}
          </span>
          <span className="text-zinc-400">
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </span>
        </div>
      </div>

      {/* Permission chips */}
      {expanded && (
        <div className="p-4 flex flex-wrap gap-2.5 bg-[#16161a]/90">
          {perms.map((perm) => {
            const action = perm.permission.includes(":") ? perm.permission.split(":")[1] : perm.permission;
            const isSelected = selectedIds.has(perm.id);
            return (
              <div
                key={perm.id}
                onClick={() => onToggleSelect(perm.id)}
                className={`group relative flex items-center gap-2.5 border rounded-md px-3.5 py-2 text-sm transition-colors cursor-pointer select-none ${
                  isSelected
                    ? "ring-1 ring-[#f84565]"
                    : "hover:border-zinc-500"
                } ${getActionColor(action)}`}
                title={perm.description || perm.permission}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 border-[#393939] accent-[#f84565] pointer-events-none"
                />

                <span className="font-semibold text-sm">{translateAction(action)}</span>

                {/* Hover actions */}
                <div
                  className="flex items-center gap-1 ml-1.5 border-l border-current/20 pl-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onEdit(perm)}
                    className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(perm.id)}
                    className="p-1 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

interface PermissionPanelProps {
  permissions: SysPermission[];
  isLoading: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (p: number) => void;
  onSearchChange: (name: string, value: any) => void;
  onResetFilters: () => void;
  onDelete: (id: string) => void;
  onDeleteBatch: (ids: string[]) => void;
  onFormSuccess: () => void;
  editingPermission: SysPermission | null;
  isCreatingPermission: boolean;
  isEditingPermission: boolean;
  toggleCreatingPermission: () => void;
  toggleEditingPermission: () => void;
  startEditingPermission: (p: SysPermission) => void;
}

export default function PermissionPanel({
  permissions,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  onSearchChange,
  onResetFilters,
  onDelete,
  onDeleteBatch,
  onFormSuccess,
  editingPermission,
  isCreatingPermission,
  isEditingPermission,
  toggleCreatingPermission,
  toggleEditingPermission,
  startEditingPermission,
}: PermissionPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Client-side & Server-side unified search
  const filtered = useMemo(
    () =>
      permissions.filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const action = p.permission.includes(":") ? p.permission.split(":")[1] : p.permission;
        const group = p.permission.includes(":") ? p.permission.split(":")[0] : "other";
        const translatedAct = translateAction(action).toLowerCase();
        const translatedGrp = translateGroup(group).toLowerCase();
        return (
          p.permission.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          translatedAct.includes(q) ||
          translatedGrp.includes(q)
        );
      }),
    [permissions, search],
  );

  const grouped = useMemo(() => groupPermissions(filtered), [filtered]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleToggleGroup = useCallback((perms: SysPermission[]) => {
    const allSel = perms.every((p) => selectedIds.has(p.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      allSel ? perms.forEach((p) => next.delete(p.id)) : perms.forEach((p) => next.add(p.id));
      return next;
    });
  }, [selectedIds]);

  const handleDeleteBatch = () => {
    if (!selectedIds.size) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} quyền đã chọn?`)) return;
    onDeleteBatch(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleSingleDelete = (id: string) => {
    onDelete(id);
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleEditPerm = (p: SysPermission) => {
    startEditingPermission(p);
  };

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          {/* Smart Unified search */}
          <div className="relative min-w-[260px] max-w-md flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                onSearchChange("permission", val);
              }}
              placeholder="Tìm kiếm quyền (ví dụ: Phim, Xem, Tạo mới, Xóa...)"
              className="w-full bg-[#202025] border border-[#393939] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#f84565] transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              onResetFilters();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-300 border border-[#393939] rounded-md bg-[#202025] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RefreshCw size={12} /> Đặt lại
          </button>
        </div>

        {/* Add permission */}
        <button
          type="button"
          onClick={toggleCreatingPermission}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#f84565] hover:bg-[#d63451] rounded-md transition-colors cursor-pointer"
        >
          <Plus size={14} /> Thêm Quyền
        </button>
      </div>

      {/* ── Stats / Selection Bar ── */}
      {selectedIds.size > 0 ? (
        <div className="bg-[#f84565]/10 border border-[#f84565]/25 px-4 py-2.5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#f84565] animate-pulse" />
            <span className="text-white text-xs font-medium">
              Đã chọn <span className="font-bold text-[#f84565]">{selectedIds.size}</span> quyền
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-zinc-400 hover:text-white text-xs px-2.5 py-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
            >
              Bỏ chọn tất cả
            </button>
            <button
              type="button"
              onClick={handleDeleteBatch}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#f84565] hover:bg-[#d63451] rounded-md transition-all cursor-pointer"
            >
              <Trash2 size={12} />
              Xóa ({selectedIds.size})
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>
            Tổng cộng: <span className="text-white font-semibold">{totalElements}</span> quyền
          </span>
          <span>•</span>
          <span>
            Phân loại: <span className="text-white font-semibold">{Object.keys(grouped).length}</span> nhóm
          </span>
        </div>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-zinc-400">
          <Loader2 size={20} className="animate-spin text-[#f84565]" />
          <span className="text-sm">Đang tải danh sách quyền...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-[#2e2e34]">
          <Key size={36} className="text-zinc-600" />
          <p className="text-zinc-400 text-sm">Không tìm thấy quyền nào</p>
          <button
            type="button"
            onClick={toggleCreatingPermission}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-white bg-[#f84565] hover:bg-[#d63451] rounded-md transition-colors cursor-pointer"
          >
            <Plus size={13} /> Thêm quyền mới
          </button>
        </div>
      ) : (
        <div className="grid gap-2">
          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([group, perms]) => (
              <GroupCard
                key={group}
                group={group}
                perms={perms}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleGroup={handleToggleGroup}
                onEdit={handleEditPerm}
                onDelete={handleSingleDelete}
              />
            ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-zinc-400">
            Trang {currentPage} / {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-2.5 py-1 text-xs border border-[#393939] rounded text-zinc-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, idx, arr) => (
                <div key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1.5 text-zinc-500 text-xs">…</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`px-2.5 py-1 text-xs border rounded transition-colors cursor-pointer ${
                      p === currentPage
                        ? "bg-[#f84565] border-[#f84565] text-white"
                        : "border-[#393939] text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    {p}
                  </button>
                </div>
              ))}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-2.5 py-1 text-xs border border-[#393939] rounded text-zinc-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* ── Create dialog ── */}
      <Dialog open={isCreatingPermission} onOpenChange={(o) => { if (!o) toggleCreatingPermission(); }}>
        <DialogContent
          showCloseButton={false}
          className="max-w-lg w-[95vw] bg-[#131316] border border-[#2a2a2e] text-white p-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] gap-0"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2e]">
            <div>
              <h2 className="text-white font-semibold text-base">Thêm quyền mới</h2>
              <p className="text-[#797b7d] text-xs mt-0.5">Điền thông tin dưới đây</p>
            </div>
            <button onClick={toggleCreatingPermission} className="text-[#797b7d] hover:text-white transition-colors">✕</button>
          </div>
          <div className="px-6 py-6">
            <PermissionForm
              initialData={null}
              onCancel={toggleCreatingPermission}
              onSuccess={onFormSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit dialog ── */}
      <Dialog open={isEditingPermission} onOpenChange={(o) => { if (!o) toggleEditingPermission(); }}>
        <DialogContent
          showCloseButton={false}
          className="max-w-lg w-[95vw] bg-[#131316] border border-[#2a2a2e] text-white p-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] gap-0"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2e]">
            <div>
              <h2 className="text-white font-semibold text-base">Chỉnh sửa quyền</h2>
              <p className="text-[#797b7d] text-xs mt-0.5">
                <span className="font-mono text-[#797b7d]">{editingPermission?.permission}</span>
              </p>
            </div>
            <button onClick={toggleEditingPermission} className="text-[#797b7d] hover:text-white transition-colors">✕</button>
          </div>
          <div className="px-6 py-6">
            <PermissionForm
              initialData={editingPermission}
              onCancel={toggleEditingPermission}
              onSuccess={onFormSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
