export const dynamic = "force-dynamic";
import sql from "@/lib/db";
import { Card } from "@/components/ui";
import { Users, MessageSquare, FileText, Image, Layers, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

export default async function DashboardPage() {
  const [
    [{ count: newEnquiries }],
    [{ count: unreadMessages }],
    [{ count: posts }],
    [{ count: gallery }],
    [{ count: slides }],
    [{ count: events }],
    recentEnquiries,
    recentMessages,
  ] = await Promise.all([
    sql`SELECT COUNT(*) FROM "AdmissionEnquiry" WHERE status='NEW'`,
    sql`SELECT COUNT(*) FROM "ContactMessage" WHERE read=false`,
    sql`SELECT COUNT(*) FROM "Post" WHERE published=true`,
    sql`SELECT COUNT(*) FROM "GalleryImage" WHERE active=true`,
    sql`SELECT COUNT(*) FROM "HeroSlide" WHERE active=true`,
    sql`SELECT COUNT(*) FROM "CalendarEvent" WHERE active=true`,
    sql`SELECT * FROM "AdmissionEnquiry" ORDER BY "createdAt" DESC LIMIT 6`,
    sql`SELECT * FROM "ContactMessage" WHERE read=false ORDER BY "createdAt" DESC LIMIT 5`,
  ]);

  const stats = [
    { label: "New Enquiries",   value: newEnquiries,   icon: Users,          bg: "bg-crimson" },
    { label: "Unread Messages", value: unreadMessages, icon: MessageSquare,  bg: "bg-amber-500" },
    { label: "Live Posts",      value: posts,          icon: FileText,       bg: "bg-navy" },
    { label: "Gallery Photos",  value: gallery,        icon: Image,          bg: "bg-navy" },
    { label: "Hero Slides",     value: slides,         icon: Layers,         bg: "bg-navy" },
    { label: "Events",          value: events,         icon: Calendar,       bg: "bg-navy" },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="w-8 h-0.5 bg-crimson mb-3" />
        <h1 className="font-display text-3xl font-bold text-navy-dark">Dashboard</h1>
        <p className="text-slate text-sm mt-1">Welcome back — here&apos;s what&apos;s happening at Cecilia Learning Academy.</p>
      </div>

      {/* Stat cards — rendered fully server-side, no icon prop crossing boundary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, bg }) => (
          <div key={label} className="bg-white border border-ivory-dark shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate uppercase tracking-wider mb-1">{label}</p>
                <p className="text-3xl font-display font-bold text-navy-dark">{value}</p>
              </div>
              <div className={`w-11 h-11 flex items-center justify-center ${bg}`}>
                <Icon size={20} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-navy-dark">Recent Enquiries</h2>
            <Link href="/enquiries" className="text-xs text-crimson font-semibold hover:underline flex items-center gap-1">View all <ArrowRight size={11} /></Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="text-slate text-sm text-center py-8">No enquiries yet</p>
          ) : (
            <div className="divide-y divide-ivory-dark">
              {recentEnquiries.map((e: any) => (
                <div key={e.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy">{e.parentName}</p>
                    <p className="text-xs text-slate">{e.childName} · {e.division}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 ${e.status === "NEW" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                      {e.status}
                    </span>
                    <p className="text-xs text-slate mt-1">{formatDateTime(e.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-navy-dark">Unread Messages</h2>
            <Link href="/messages" className="text-xs text-crimson font-semibold hover:underline flex items-center gap-1">View all <ArrowRight size={11} /></Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-slate text-sm text-center py-8">No unread messages</p>
          ) : (
            <div className="divide-y divide-ivory-dark">
              {recentMessages.map((m: any) => (
                <div key={m.id} className="py-3">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-navy">{m.name}</p>
                    <p className="text-xs text-slate">{formatDateTime(m.createdAt)}</p>
                  </div>
                  <p className="text-xs font-semibold text-slate">{m.subject}</p>
                  <p className="text-xs text-slate/70 truncate mt-0.5">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
