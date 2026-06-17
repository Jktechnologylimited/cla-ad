"use client";
import { useState, useEffect } from "react";
import { PageHeader, Card, Btn, Input, Select, Textarea, Modal, ConfirmModal, EmptyState, Table } from "@/components/ui";
import { Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const CATEGORIES = ["General", "Academic", "Sports", "Cultural", "Examination", "Holiday", "Meeting", "Graduation"];
const COLORS = [
  { label: "Navy Blue", value: "#1B4B8A" },
  { label: "Crimson Red", value: "#C0182A" },
  { label: "Green", value: "#16a34a" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Amber", value: "#d97706" },
];

const EMPTY = { title: "", description: "", startDate: "", endDate: "", category: "General", color: "#1B4B8A" };

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/events");
    const d = await r.json();
    setEvents(d.events || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setModal("create"); };
  const openEdit = (e: any) => {
    setEditing(e);
    setForm({ title: e.title, description: e.description || "", startDate: e.startDate?.slice(0, 16), endDate: e.endDate?.slice(0, 16) || "", category: e.category, color: e.color });
    setModal("edit");
  };

  const save = async () => {
    setSaving(true);
    if (modal === "create") {
      await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else if (editing) {
      await fetch(`/api/events/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false);
    setModal(null);
    load();
  };

  const del = async () => {
    if (!deleteId) return;
    await fetch(`/api/events/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  };

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <PageHeader title="Events & Calendar" subtitle={`${events.length} events`}>
        <Btn onClick={openCreate}><Plus size={14} /> Add Event</Btn>
      </PageHeader>

      <Card>
        {loading ? (
          <div className="text-center py-16 text-slate text-sm">Loading...</div>
        ) : events.length === 0 ? (
          <EmptyState message="No events yet. Add your first event." icon={Calendar} />
        ) : (
          <Table headers={["Title", "Category", "Start Date", "End Date", "Actions"]}>
            {events.map((e: any) => (
              <tr key={e.id} className="hover:bg-ivory/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: e.color }} />
                    <div>
                      <p className="text-sm font-medium text-navy">{e.title}</p>
                      {e.description && <p className="text-xs text-slate mt-0.5 line-clamp-1">{e.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate">{e.category}</td>
                <td className="px-4 py-3 text-xs text-slate">{formatDate(e.startDate)}</td>
                <td className="px-4 py-3 text-xs text-slate">{e.endDate ? formatDate(e.endDate) : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <Btn size="sm" variant="ghost" onClick={() => openEdit(e)}><Pencil size={13} /></Btn>
                    <Btn size="sm" variant="ghost" onClick={() => setDeleteId(e.id)} className="hover:text-crimson"><Trash2 size={13} /></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {modal && (
        <Modal title={modal === "create" ? "Add Event" : "Edit Event"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Input label="Event Title *" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. End of Year Graduation Ceremony" />
            <Textarea label="Description" rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description of the event..." />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date & Time *" type="datetime-local" value={form.startDate} onChange={e => set("startDate", e.target.value)} />
              <Input label="End Date & Time" type="datetime-local" value={form.endDate} onChange={e => set("endDate", e.target.value)} />
              <Select label="Category" value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
              <Select label="Colour" value={form.color} onChange={e => set("color", e.target.value)}>
                {COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Btn onClick={save} loading={saving} className="flex-1 justify-center">{modal === "create" ? "Add Event" : "Save Changes"}</Btn>
              <Btn variant="secondary" onClick={() => setModal(null)} className="flex-1 justify-center">Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && <ConfirmModal message="Delete this event?" onConfirm={del} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
