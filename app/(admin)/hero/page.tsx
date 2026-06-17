"use client";
import { useState, useEffect } from "react";
import { PageHeader, Card, Btn, Input, Textarea, Modal, ConfirmModal, EmptyState, StatusBadge } from "@/components/ui";
import { Layers, Plus, Pencil, Trash2, GripVertical } from "lucide-react";

type Slide = { id: string; tag: string; title: string; subtitle: string; ctaLabel: string; ctaHref: string; cta2Label: string; cta2Href: string; order: number; active: boolean; };
const EMPTY: Omit<Slide, "id" | "order" | "active"> = { tag: "", title: "", subtitle: "", ctaLabel: "Apply Now", ctaHref: "/admissions", cta2Label: "Learn More", cta2Href: "/about" };

export default function HeroPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/hero");
    const d = await r.json();
    setSlides(d.slides || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setModal("create"); };
  const openEdit   = (s: Slide) => { setEditing(s); setForm({ tag: s.tag, title: s.title, subtitle: s.subtitle, ctaLabel: s.ctaLabel, ctaHref: s.ctaHref, cta2Label: s.cta2Label, cta2Href: s.cta2Href }); setModal("edit"); };

  const save = async () => {
    setSaving(true);
    if (modal === "create") {
      await fetch("/api/hero", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else if (editing) {
      await fetch(`/api/hero/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false);
    setModal(null);
    load();
  };

  const toggleActive = async (s: Slide) => {
    await fetch(`/api/hero/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !s.active }) });
    load();
  };

  const del = async () => {
    if (!deleteId) return;
    await fetch(`/api/hero/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  };

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <PageHeader title="Hero Slides" subtitle={`${slides.length} slides · displayed in carousel on homepage`}>
        <Btn onClick={openCreate}><Plus size={14} /> Add Slide</Btn>
      </PageHeader>

      {loading ? (
        <div className="text-center py-20 text-slate text-sm">Loading...</div>
      ) : slides.length === 0 ? (
        <EmptyState message="No hero slides yet. Add your first slide." icon={Layers} />
      ) : (
        <div className="space-y-4">
          {slides.map((s, i) => (
            <Card key={s.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 text-silver pt-1">
                  <GripVertical size={16} />
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-semibold text-crimson uppercase tracking-wider">{s.tag}</span>
                    <StatusBadge status={s.active ? "true" : "false"} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy-dark truncate">{s.title}</h3>
                  <p className="text-sm text-slate mt-1 line-clamp-2">{s.subtitle}</p>
                  <div className="flex gap-4 mt-2 text-xs text-slate">
                    <span>CTA 1: <strong>{s.ctaLabel}</strong> → {s.ctaHref}</span>
                    <span>CTA 2: <strong>{s.cta2Label}</strong> → {s.cta2Href}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Btn size="sm" variant="secondary" onClick={() => toggleActive(s)}>{s.active ? "Deactivate" : "Activate"}</Btn>
                  <Btn size="sm" variant="secondary" onClick={() => openEdit(s)}><Pencil size={13} /></Btn>
                  <Btn size="sm" variant="danger" onClick={() => setDeleteId(s.id)}><Trash2 size={13} /></Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <Modal title={modal === "create" ? "Add Hero Slide" : "Edit Hero Slide"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Input label="Tag / Eyebrow *" value={form.tag} onChange={e => set("tag", e.target.value)} placeholder="e.g. Welcome to CLA" />
            <Input label="Headline / Title *" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Shaping Tomorrow's Leaders Today" />
            <Textarea label="Subtitle *" rows={3} value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="Supporting text under the headline..." />
            <div className="grid grid-cols-2 gap-4">
              <Input label="CTA 1 Label" value={form.ctaLabel} onChange={e => set("ctaLabel", e.target.value)} />
              <Input label="CTA 1 Link" value={form.ctaHref} onChange={e => set("ctaHref", e.target.value)} placeholder="/admissions" />
              <Input label="CTA 2 Label" value={form.cta2Label} onChange={e => set("cta2Label", e.target.value)} />
              <Input label="CTA 2 Link" value={form.cta2Href} onChange={e => set("cta2Href", e.target.value)} placeholder="/about" />
            </div>
            <div className="flex gap-3 pt-2">
              <Btn onClick={save} loading={saving} className="flex-1 justify-center">{modal === "create" ? "Create Slide" : "Save Changes"}</Btn>
              <Btn variant="secondary" onClick={() => setModal(null)} className="flex-1 justify-center">Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteId && <ConfirmModal message="Delete this hero slide? This cannot be undone." onConfirm={del} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
