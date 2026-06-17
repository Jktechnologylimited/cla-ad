"use client";
import { useState } from "react";
import { PageHeader, Card, Btn, Modal } from "@/components/ui";
import { MessageSquare, Mail } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState("ALL");

  const unread = messages.filter(m => !m.read).length;
  const filtered = filter === "UNREAD" ? messages.filter(m => !m.read) : messages;

  const markRead = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const open = async (m: any) => {
    setSelected(m);
    if (!m.read) markRead(m.id);
  };

  return (
    <div>
      <PageHeader title="Contact Messages" subtitle={`${unread} unread · ${messages.length} total`} />

      <div className="flex gap-2 mb-6">
        {["ALL", "UNREAD"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${filter === f ? "bg-navy text-white" : "bg-white border border-ivory-dark text-slate hover:text-navy"}`}>
            {f} {f === "UNREAD" && `(${unread})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate text-sm border-2 border-dashed border-ivory-dark">
          <MessageSquare size={36} className="text-silver mx-auto mb-3" />
          <p>No messages found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m: any) => (
            <Card key={m.id} className={`p-5 cursor-pointer hover:shadow-md transition-shadow ${!m.read ? "border-l-4 border-l-crimson" : ""}`}
              onClick={() => open(m)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-semibold text-navy">{m.name}</p>
                    {!m.read && <span className="text-[10px] bg-crimson text-white px-1.5 py-0.5 font-bold uppercase">New</span>}
                  </div>
                  <p className="text-xs text-slate mb-1">{m.email} {m.phone ? `· ${m.phone}` : ""}</p>
                  <p className="text-sm font-medium text-navy-dark">{m.subject}</p>
                  <p className="text-xs text-slate mt-1 line-clamp-2">{m.message}</p>
                </div>
                <p className="text-xs text-slate shrink-0">{formatDateTime(m.createdAt)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <Modal title="Message" onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="bg-ivory border border-ivory-dark p-4 grid grid-cols-2 gap-3 text-sm">
              {[["From", selected.name], ["Email", selected.email], ["Phone", selected.phone || "—"], ["Date", formatDateTime(selected.createdAt)]].map(([l, v]) => (
                <div key={l}>
                  <p className="text-xs text-slate uppercase tracking-wider mb-0.5">{l}</p>
                  <p className="font-medium text-navy">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-slate uppercase tracking-wider mb-1">Subject</p>
              <p className="font-semibold text-navy">{selected.subject}</p>
            </div>
            <div>
              <p className="text-xs text-slate uppercase tracking-wider mb-2">Message</p>
              <p className="text-slate leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}>
              <Btn className="w-full justify-center"><Mail size={14} /> Reply via Email</Btn>
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}
