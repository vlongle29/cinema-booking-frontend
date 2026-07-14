import { useState, useMemo, useCallback } from "react";
import {
  Key, Plus, Trash2, Edit2, Search, RefreshCw,
  ChevronDown, ChevronRight, Loader2, ShieldCheck,
} from "lucide-react";
import type { SysPermission } from "@/types/rbac";
import PermissionForm from "./PermissionForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ─── helpers ────────────────────────────────────────────────────────────────

const ACTION_COLOR: Record<string, string> = {
  view:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  create: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  update: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  delete: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  manage: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  export: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};
const ACTION_DEFAULT = "bg-[#252529] text-[#d1d5dc] border-[#393939]";

function getActionColor(action: string) {
  return ACTION_COLOR[action.toLowerCase()] ?? ACTION_DEFAULT;
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
  const allSelected = perms.every((p) => selectedIds.has(p.id));
  const someSelected = perms.some((p) => selectedIds.has(p.id));

  return (
    <div className="border border-[#2a2a2e] rounded-xl overflow-hidden bg-[#111114]">
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1e] hover:bg-[#1e1e22] transition-colors">
        {/* Group checkbox */}
        <button
          onClick={() => onToggleGroup(perms)}
          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
            allSelected
              ? "bg-[#f84565] border-[#f84565]"
              : someSelected
                ? "bg-[#f84565]/30 border-[#f84565]/50"
                : "border-[#393939] bg-transparent hover:border-[#f84565]/50"
          }`}
        >
          {(allSelected || someSelected) && (
            <span className="block w-2 h-0.5 bg-white rounded" />
          )}
        </button>

        {/* Icon + name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ShieldCheck size={14} className="text-[#f84565] flex-shrink-0" />
          <span className="font-semibold text-white text-sm uppercase tracking-wide truncate">
            {group}
          </span>
          <span className="text-[11px] text-[#555] bg-[#252529] px-1.5 py-0.5 rounded-md">
            {perms.length}
          </span>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[#555] hover:text-white transition-colors"
        >
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>

      {/* Permission chips */}
      {expanded && (
        <div className="p-4 flex flex-wrap gap-2">
          {perms.map((perm) => {
            const action = perm.permission.includes(":") ? perm.permission.split(":")[1] : perm.permission;
            const isSelected = selectedIds.has(perm.id);
            return (
              <div
                key={perm.id}
                className={`group relative flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 transition-all cursor-pointer select-none ${
                  isSelected ? "ring-1 ring-[#f84565] shadow-sm shadow-rose-500/20" : ""
                } ${getActionColor(action)}`}
                onClick={() => onToggleSelect(perm.id)}
                title={perm.description ?? perm.permission}
              >
                <span className="text-xs font-mono font-medium">{action}</span>

                {/* Hover actions */}
                <div
                  className="hidden group-hover:flex items-center gap-0.5 ml-1 border-l border-current/20 pl-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEdit(perm)}
                    className="hover:text-white transition-colors opacity-70 hover:opacity-100"
                    title="Sửa"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={() => onDelete(perm.id)}
                    className="hover:text-rose-400 transition-colors opacity-70 hover:opacity-100"
                    title="Xóa"
                  >
                    <Trash2 size={11} />
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

  // Client-side filter by search input (on top of server search)
  const filtered = useMemo(
    () =>
      permissions.filter(
        (p) =>
          p.permission.toLowerCase().includes(search.toLowerCase()) ||
          (p.description ?? "").toLowerCase().includes(search.toLowerCase()),
      ),
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

  const handleServerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange("permission", e.target.value);
  };

  const handleDeleteBatch = () => {
    if (!selectedIds.size) return;
    if (!window.confirm(`Xóa ${selectedIds.size} quyền đã chọn?`)) return;
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
      <div className="flex flex-wrap items-center gap-3">
        {/* Server search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            placeholder="Tìm quyền theo tên..."
            onChange={handleServerSearch}
            className="w-full bg-[#1a1a1e] border border-[#393939] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#f84565] transition-colors"
          />
        </div>

        {/* Local filter */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Lọc nhanh trong trang..."
            className="w-full bg-[#1a1a1e] border border-[#393939] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#f84565] transition-colors"
          />
        </div>

        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#d1d5dc] border border-[#393939] rounded-lg hover:bg-white/5 transition-colors"
        >
          <RefreshCw size={13} /> Reset
        </button>

        <div className="flex-1" />

        {/* Batch delete */}
        {selectedIds.size > 0 && (
          <button
            onClick={handleDeleteBatch}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 border border-rose-500/30 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 size={13} />
            Xóa {selectedIds.size} quyền
          </button>
        )}

        {/* Add permission */}
        <button
          onClick={toggleCreatingPermission}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#f84565] rounded-lg hover:bg-[#d63352] transition-colors shadow-lg shadow-rose-500/20"
        >
          <Plus size={15} /> Thêm Quyền
        </button>
      </div>

      {/* ── Stats bar ── */}
      <div className="flex items-center gap-4 text-xs text-[#555]">
        <span>
          <span className="text-white font-medium">{totalElements}</span> quyền tổng cộng
        </span>
        <span>·</span>
        <span>
          <span className="text-white font-medium">{Object.keys(grouped).length}</span> nhóm
        </span>
        {selectedIds.size > 0 && (
          <>
            <span>·</span>
            <span>
              Đã chọn{" "}
              <span className="text-[#f84565] font-medium">{selectedIds.size}</span>
            </span>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-[#797b7d] hover:text-white underline"
            >
              Bỏ chọn tất cả
            </button>
          </>
        )}
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-[#797b7d]">
          <Loader2 size={20} className="animate-spin text-[#f84565]" />
          <span>Đang tải danh sách quyền...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-[#2a2a2e] rounded-xl">
          <Key size={40} className="text-[#2a2a2e]" />
          <p className="text-[#555] text-sm">Không tìm thấy quyền nào</p>
          <button
            onClick={toggleCreatingPermission}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-[#f84565] rounded-lg hover:bg-[#d63352] transition-colors"
          >
            <Plus size={14} /> Thêm quyền mới
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
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
          <span className="text-xs text-[#555]">Trang {currentPage} / {totalPages}</span>
          <div className="flex gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1.5 text-xs border border-[#393939] rounded-lg text-[#d1d5dc] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, idx, arr) => (
                <>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span key={`el-${p}`} className="px-2 text-[#555] self-center">…</span>
                  )}
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1.5 text-xs border rounded-lg transition-colors ${
                      p === currentPage
                        ? "bg-[#f84565] border-[#f84565] text-white"
                        : "border-[#393939] text-[#d1d5dc] hover:bg-white/5"
                    }`}
                  >
                    {p}
                  </button>
                </>
              ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1.5 text-xs border border-[#393939] rounded-lg text-[#d1d5dc] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                <span className="font-mono text-emerald-400">{editingPermission?.permission}</span>
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
