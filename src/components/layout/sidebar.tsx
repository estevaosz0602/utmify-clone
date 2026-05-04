"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Link2,
  Webhook,
  BookOpen,
  TrendingUp,
  Settings,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Resumo", href: "/dashboard", icon: BarChart3 },
  { label: "UTM Analytics", href: "/dashboard/utm", icon: Link2 },
  { label: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
  { label: "Documentação", href: "/dashboard/docs", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col h-screen w-64 flex-shrink-0"
      style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--accent)" }}>
          <TrendingUp size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">UTMify</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors group"
              style={{
                background: active ? "rgba(124, 58, 237, 0.15)" : "transparent",
                color: active ? "#a78bfa" : "var(--muted)",
              }}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                {item.label}
              </div>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border)" }}>
        <Link
          href="/dashboard/webhooks"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          style={{ color: "var(--muted)" }}
        >
          <Settings size={16} />
          Configurações
        </Link>
      </div>
    </aside>
  );
}
