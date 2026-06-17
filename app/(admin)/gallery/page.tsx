"use client";
import { useState, useEffect } from "react";
import { PageHeader, Card, Btn, Input, Select, ConfirmModal, EmptyState } from "@/components/ui";
import { Image as ImageIcon, Upload, Trash2, Plus } from "lucide-react";
import Image from "next/image";

const CATEGORIES = ["General", "Classrooms", "Events", "Sports", "Graduation", "Cultural", "Nursery & Crèche", "Primary", "Secondary"];

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("General");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/gallery");
    const d = await r.json();
    setImages(d.images || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "cla/gallery");
    const ur = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await ur.json();
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, caption, category }),
    });
    setCaption("");
    setUploading(false);
    load();
  };

  const del = async () => {
    if (!deleteId) return;
    await fetch(`/api/gallery/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  };

  const filtered = filter === "All" ? images : images.filter((i: any) => i.category === filter);

  return (
    <div>
      <PageHeader title="Gallery" subtitle={`${images.length} photos`} />

      {/* Upload box */}
      <Card className="p-6 mb-8">
        <h2 className="font-display text-lg font-bold text-navy-dark mb-4">Upload New Photo</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <Select label="Category" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <div className="md:col-span-2">
            <Input label="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Students during cultural day 2024" />
          </div>
        </div>
        <label className={`flex items-center justify-center gap-3 border-2 border-dashed p-8 cursor-pointer transition-colors ${uploading ? "border-navy bg-navy/5" : "border-silver/40 hover:border-navy"}`}>
          {uploading ? (
            <div className="flex items-center gap-2 text-navy text-sm font-medium">
              <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
              Uploading photo...
            </div>
          ) : (
            <>
              <Upload size={22} className="text-silver" />
              <div>
                <p className="text-sm font-medium text-slate">Click to upload photo</p>
                <p className="text-xs text-silver mt-0.5">JPG, PNG, WebP — max 10MB</p>
              </div>
            </>
          )}
          <input type="file" accept="image/*" className="hidden"
            onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} disabled={uploading} />
        </label>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${filter === c ? "bg-navy text-white" : "bg-white border border-ivory-dark text-slate hover:text-navy"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <EmptyState message="No photos yet. Upload your first photo above." icon={ImageIcon} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img: any) => (
            <div key={img.id} className="group relative aspect-square bg-ivory-dark overflow-hidden">
              <Image src={img.url} alt={img.caption || "Gallery"} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-xs font-medium mb-1 line-clamp-2">{img.caption || "No caption"}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-[10px] uppercase tracking-wider">{img.category}</span>
                  <button onClick={() => setDeleteId(img.id)} className="text-white/70 hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && <ConfirmModal message="Delete this photo permanently?" onConfirm={del} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
