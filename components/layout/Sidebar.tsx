"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import {
  LayoutDashboard, Layers, FileText, Image as Img,
  Calendar, Users, MessageSquare, Settings,
  LogOut, ExternalLink, ChevronRight, ChevronLeft,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
  { href: "/hero",       label: "Hero Slides",   icon: Layers },
  { href: "/posts",      label: "News & Blog",   icon: FileText },
  { href: "/gallery",    label: "Gallery",       icon: Img },
  { href: "/events",     label: "Events",        icon: Calendar },
  { href: "/enquiries",  label: "Enquiries",     icon: Users },
  { href: "/messages",   label: "Messages",      icon: MessageSquare },
  { href: "/settings",   label: "Site Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebar();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className={`${collapsed ? "w-[68px]" : "w-64"} bg-navy-dark flex flex-col fixed inset-y-0 left-0 z-30 shadow-xl transition-all duration-300`}>

      {/* Logo + collapse button */}
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between gap-2">
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <Image src="/cla-logo.png" alt="CLA" width={38} height={38} className="object-contain shrink-0" />
            <div className="min-w-0">
              <div className="font-display text-white font-bold text-sm leading-tight truncate">Cecilia Learning</div>
              <div className="text-crimson text-[10px] font-semibold">Admin Portal</div>
            </div>
          </div>
        )}
        {collapsed && (
          <Image src="/cla-logo.png" alt="CLA" width={34} height={34} className="object-contain mx-auto" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/30 hover:text-white transition-colors p-1 shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors relative group
                ${collapsed ? "justify-center" : ""}
                ${active ? "bg-crimson text-white font-semibold" : "text-white/60 hover:text-white hover:bg-white/8"}`}>
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
              {!collapsed && active && <ChevronRight size={13} />}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-navy-dark border border-white/10
                  text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100
                  group-hover:visible transition-all shadow-xl z-50 pointer-events-none">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 py-3 border-t border-white/10 space-y-0.5">
        {!collapsed ? (
          <>
            <a href="https://cecilialearningacademy.com.ng" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-xs text-white/40 hover:text-white/70 transition-colors">
              <ExternalLink size={13} /> View Public Website
            </a>
            <button onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs text-white/40 hover:text-crimson-light transition-colors">
              <LogOut size={13} /> Sign Out
            </button>
            <div className="pt-3 flex items-center gap-2 px-3">
              <Image src="/jk-logo.png" alt="JK Technology" width={12} height={12} className="opacity-20 invert object-contain" />
              <span className="text-[10px] text-white/20">JK Technology Limited</span>
            </div>
          </>
        ) : (
          <>
            <a href="https://cecilialearningacademy.com.ng" target="_blank" rel="noopener noreferrer"
              title="View Public Website"
              className="flex justify-center py-2.5 text-white/30 hover:text-white/70 transition-colors">
              <ExternalLink size={15} />
            </a>
            <button onClick={logout} title="Sign Out"
              className="w-full flex justify-center py-2.5 text-white/30 hover:text-crimson-light transition-colors">
              <LogOut size={15} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
