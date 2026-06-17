"use client";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

// ── Button ──────────────────────────────────────────────────────────
export function Btn({
  children, loading, variant = "primary", size = "md", className = "", ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "danger" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  const v = {
    primary:   "bg-navy text-white hover:bg-navy-dark",
    danger:    "bg-crimson text-white hover:bg-crimson-dark",
    secondary: "bg-white text-navy border border-silver/40 hover:bg-ivory",
    ghost:     "text-slate hover:text-navy hover:bg-ivory",
  };
  const s = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button {...props} disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-colors ${v[variant]} ${s[size]} disabled:opacity-50 ${className}`}>
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

// ── Input ───────────────────────────────────────────────────────────
export function Input({ label, error, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate uppercase tracking-wider">{label}</label>}
      <input {...props} className={`border border-silver/40 bg-white px-3 py-2.5 text-sm text-navy placeholder-silver/60 focus:outline-none focus:border-navy transition-colors ${error ? "border-crimson" : ""} ${className}`} />
      {error && <span className="text-xs text-crimson">{error}</span>}
    </div>
  );
}

// ── Select ──────────────────────────────────────────────────────────
export function Select({ label, error, children, className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate uppercase tracking-wider">{label}</label>}
      <select {...props} className={`border border-silver/40 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-navy transition-colors ${error ? "border-crimson" : ""} ${className}`}>
        {children}
      </select>
      {error && <span className="text-xs text-crimson">{error}</span>}
    </div>
  );
}

// ── Textarea ─────────────────────────────────────────────────────────
export function Textarea({ label, error, className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate uppercase tracking-wider">{label}</label>}
      <textarea {...props} className={`border border-silver/40 bg-white px-3 py-2.5 text-sm text-navy placeholder-silver/60 focus:outline-none focus:border-navy transition-colors resize-none ${error ? "border-crimson" : ""} ${className}`} />
      {error && <span className="text-xs text-crimson">{error}</span>}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────
export function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`bg-white border border-ivory-dark shadow-sm ${className}`} onClick={onClick}>{children}</div>;
}

// ── Page Header ──────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <div className="w-8 h-0.5 bg-crimson mb-3" />
        <h1 className="font-display text-3xl font-bold text-navy-dark">{title}</h1>
        {subtitle && <p className="text-slate text-sm mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3 mt-1">{children}</div>}
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = "navy" }: { label: string; value: string | number; icon: any; color?: string }) {
  const colors: Record<string, string> = {
    navy: "bg-navy", crimson: "bg-crimson", green: "bg-green-600", amber: "bg-amber-500",
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-display font-bold text-navy-dark">{value}</p>
        </div>
        <div className={`w-11 h-11 flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </Card>
  );
}

// ── Badge ────────────────────────────────────────────────────────────
export function Badge({ label, className = "" }: { label: string; className?: string }) {
  return <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 uppercase tracking-wide ${className}`}>{label}</span>;
}

// ── Status Badge ─────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    NEW:         "bg-yellow-100 text-yellow-800",
    CONTACTED:   "bg-blue-100 text-blue-800",
    ENROLLED:    "bg-green-100 text-green-800",
    DECLINED:    "bg-red-100 text-red-800",
    true:        "bg-green-100 text-green-800",
    false:       "bg-gray-100 text-gray-600",
    PUBLISHED:   "bg-green-100 text-green-800",
    DRAFT:       "bg-gray-100 text-gray-600",
    NEWS:        "bg-navy/10 text-navy",
    EVENT:       "bg-purple-100 text-purple-800",
    BLOG:        "bg-blue-100 text-blue-800",
    ANNOUNCEMENT:"bg-amber-100 text-amber-800",
  };
  return <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 uppercase tracking-wide ${map[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>;
}

// ── Table ─────────────────────────────────────────────────────────────
export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-ivory border-b border-ivory-dark">
          <tr>
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ivory-dark">{children}</tbody>
      </table>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-dark">
          <div>
            <div className="w-6 h-0.5 bg-crimson mb-1.5" />
            <h2 className="font-display text-xl font-bold text-navy-dark">{title}</h2>
          </div>
          <button onClick={onClose} className="text-slate hover:text-navy text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────
export function EmptyState({ message, icon: Icon }: { message: string; icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate">
      <Icon size={40} className="mb-4 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ── Confirm Delete ────────────────────────────────────────────────────
export function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm shadow-2xl p-8 text-center">
        <p className="text-navy font-medium mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
          <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
        </div>
      </div>
    </div>
  );
}
