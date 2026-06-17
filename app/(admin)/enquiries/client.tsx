"use client";
import { useState } from "react";
import { PageHeader, Card, Btn, Select, Modal, Textarea, Table, StatusBadge } from "@/components/ui";
import { Users } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

const STATUSES = ["NEW", "CONTACTED", "ENROLLED", "DECLINED"];

export default function EnquiriesClient({ initialEnquiries, stats }: { initialEnquiries: any[]; stats: any }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [selected, setSelected] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? enquiries : enquiries.filter(e => e.status === filter);

  const openDetail = (e: any) => { setSelected(e); setNewStatus(e.status); setNotes(e.notes || ""); };

  const updateStatus = async () => {
    if (!selected) return;
    setUpdating(true);
    const r = await fetch(`/api/enquiries/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, notes }),
    });
    const d = await r.json();
    setEnquiries(prev => prev.map(e => e.id === selected.id ? d.enquiry : e));
    setSelected(null);
    setUpdating(false);
  };

  return (
    <div>
      <PageHeader title="Admission Enquiries" subtitle={`${stats.total} total · ${stats.new} new · ${stats.contacted} contacted · ${stats.enrolled} enrolled`} />

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["ALL", ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${filter === s ? "bg-navy text-white" : "bg-white border border-ivory-dark text-slate hover:text-navy"}`}>
            {s} {s !== "ALL" && `(${enquiries.filter(e => e.status === s).length})`}
          </button>
        ))}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate text-sm">No enquiries found.</div>
        ) : (
          <Table headers={["Parent", "Child", "Division", "Contact", "Date", "Status", ""]}>
            {filtered.map((e: any) => (
              <tr key={e.id} className={`hover:bg-ivory/50 transition-colors ${e.status === "NEW" ? "bg-yellow-50/50" : ""}`}>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-navy">{e.parentName}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-navy">{e.childName}</p>
                  <p className="text-xs text-slate">DOB: {e.childDOB}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold bg-navy/10 text-navy px-2 py-0.5 uppercase">{e.division}</span>
                </td>
                <td className="px-4 py-3">
                  <a href={`mailto:${e.email}`} className="text-xs text-navy hover:text-crimson transition-colors block">{e.email}</a>
                  <a href={`tel:${e.phone}`} className="text-xs text-slate hover:text-crimson transition-colors">{e.phone}</a>
                </td>
                <td className="px-4 py-3 text-xs text-slate">{formatDateTime(e.createdAt)}</td>
                <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                <td className="px-4 py-3">
                  <Btn size="sm" variant="secondary" onClick={() => openDetail(e)}>Manage</Btn>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Detail Modal */}
      {selected && (
        <Modal title="Manage Enquiry" onClose={() => setSelected(null)}>
          <div className="space-y-5">
            {/* Enquiry summary */}
            <div className="bg-ivory border border-ivory-dark p-4 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Parent", selected.parentName],
                ["Child", selected.childName],
                ["Date of Birth", selected.childDOB],
                ["Division", selected.division],
                ["Email", selected.email],
                ["Phone", selected.phone],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="font-medium text-navy">{value}</p>
                </div>
              ))}
              {selected.message && (
                <div className="col-span-2">
                  <p className="text-xs text-slate uppercase tracking-wider mb-0.5">Message</p>
                  <p className="text-slate italic">{selected.message}</p>
                </div>
              )}
            </div>

            <Select label="Update Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>

            <Textarea label="Internal Notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes about this enquiry..." />

            <div className="flex gap-3">
              <Btn onClick={updateStatus} loading={updating} className="flex-1 justify-center">Save Changes</Btn>
              <a href={`mailto:${selected.email}`} className="flex-1">
                <Btn variant="secondary" className="w-full justify-center">Send Email</Btn>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
