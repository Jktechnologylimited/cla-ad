"use client";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function AdminContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <main className={`flex-1 min-h-screen transition-all duration-300 ${collapsed ? "ml-[68px]" : "ml-64"}`}>
      <div className="p-8 max-w-6xl mx-auto">{children}</div>
    </main>
  );
}
