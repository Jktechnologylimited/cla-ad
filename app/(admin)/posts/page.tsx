"use client";
import { useState, useEffect } from "react";
import { PageHeader, Card, Btn, Input, Select, Textarea, Modal, ConfirmModal, EmptyState, StatusBadge, Table } from "@/components/ui";
import { FileText, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Post = { id: string; type: string; title: string; slug: string; excerpt: string; content: string; coverImage: string; published: boolean; author: string; tags: string[]; createdAt: string; };
const EMPTY = { type: "NEWS", title: "", excerpt: "", content: "", coverImage: "", author: "Cecilia Learning Academy", tags: "" };

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/posts");
    const d = await r.json();
    setPosts(d.posts || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === "ALL" ? posts : posts.filter(p => p.type === filter);

  const openCreate = () => { setForm(EMPTY); setModal("create"); };
  const openEdit   = (p: Post) => {
    setEditing(p);
    setForm({ type: p.type, title: p.title, excerpt: p.excerpt || "", content: p.content, coverImage: p.coverImage || "", author: p.author, tags: p.tags?.join(", ") || "" });
    setModal("edit");
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    if (modal === "create") {
      await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else if (editing) {
      await fetch(`/api/posts/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    setSaving(false);
    setModal(null);
    load();
  };

  const togglePublish = async (p: Post) => {
    await fetch(`/api/posts/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !p.published, publishedAt: !p.published ? new Date().toISOString() : null }) });
    load();
  };

  const del = async () => {
    if (!deleteId) return;
    await fetch(`/api/posts/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  };

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <PageHeader title="News & Blog" subtitle={`${posts.length} total posts`}>
        <Btn onClick={openCreate}><Plus size={14} /> New Post</Btn>
      </PageHeader>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["ALL", "NEWS", "BLOG", "EVENT", "ANNOUNCEMENT"].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${filter === t ? "bg-navy text-white" : "bg-white border border-ivory-dark text-slate hover:text-navy"}`}>
            {t}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-16 text-slate text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <EmptyState message="No posts found. Create your first post." icon={FileText} />
        ) : (
          <Table headers={["Title", "Type", "Author", "Status", "Date", "Actions"]}>
            {filtered.map((p: Post) => (
              <tr key={p.id} className="hover:bg-ivory/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-navy">{p.title}</p>
                  {p.excerpt && <p className="text-xs text-slate mt-0.5 line-clamp-1">{p.excerpt}</p>}
                </td>
                <td className="px-4 py-3"><StatusBadge status={p.type} /></td>
                <td className="px-4 py-3 text-xs text-slate">{p.author}</td>
                <td className="px-4 py-3"><StatusBadge status={p.published ? "PUBLISHED" : "DRAFT"} /></td>
                <td className="px-4 py-3 text-xs text-slate">{formatDate(p.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <Btn size="sm" variant="ghost" onClick={() => togglePublish(p)} title={p.published ? "Unpublish" : "Publish"}>
                      {p.published ? <EyeOff size={13} /> : <Eye size={13} />}
                    </Btn>
                    <Btn size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil size={13} /></Btn>
                    <Btn size="sm" variant="ghost" onClick={() => setDeleteId(p.id)} className="hover:text-crimson"><Trash2 size={13} /></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Create / Edit Modal */}
      {modal && (
        <Modal title={modal === "create" ? "Create New Post" : "Edit Post"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Title *" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Post title" />
              <Select label="Post Type *" value={form.type} onChange={e => set("type", e.target.value)}>
                {["NEWS", "BLOG", "EVENT", "ANNOUNCEMENT"].map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
            <Input label="Excerpt (short description)" value={form.excerpt} onChange={e => set("excerpt", e.target.value)} placeholder="Brief summary for listing pages..." />
            <Textarea label="Full Content *" rows={8} value={form.content} onChange={e => set("content", e.target.value)} placeholder="Write the full article content here..." />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Cover Image URL (Cloudinary)" value={form.coverImage} onChange={e => set("coverImage", e.target.value)} placeholder="https://res.cloudinary.com/..." />
              <Input label="Author" value={form.author} onChange={e => set("author", e.target.value)} />
            </div>
            <Input label="Tags (comma separated)" value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="education, news, events" />
            <div className="flex gap-3 pt-2">
              <Btn onClick={save} loading={saving} className="flex-1 justify-center">{modal === "create" ? "Create Post" : "Save Changes"}</Btn>
              <Btn variant="secondary" onClick={() => setModal(null)} className="flex-1 justify-center">Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && <ConfirmModal message="Delete this post permanently?" onConfirm={del} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
