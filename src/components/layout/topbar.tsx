"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar, RefreshCw, ChevronDown } from "lucide-react";
import { useState, useTransition } from "react";

const DATE_PRESETS = [
  { label: "Hoje", days: 0 },
  { label: "Ontem", days: 1 },
  { label: "Últimos 7 dias", days: 7 },
  { label: "Últimos 30 dias", days: 30 },
  { label: "Últimos 90 dias", days: 90 },
];

const PLATFORMS = [
  { value: "all", label: "Todas as plataformas" },
  { value: "hotmart", label: "Hotmart" },
  { value: "kiwify", label: "Kiwify" },
  { value: "eduzz", label: "Eduzz" },
  { value: "ticto", label: "Ticto" },
  { value: "perfectpay", label: "PerfectPay" },
];

function formatDate(d: Date) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function Topbar({ title }: { title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showPresets, setShowPresets] = useState(false);

  const platform = searchParams.get("platform") || "all";
  const currentDays = Number(searchParams.get("days") || "30");

  const activePlatform = PLATFORMS.find((p) => p.value === platform);
  const activePreset = DATE_PRESETS.find((p) => p.days === currentDays) || DATE_PRESETS[3];

  function navigate(params: Record<string, string>) {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => sp.set(k, v));
    startTransition(() => {
      router.push(`${pathname}?${sp.toString()}`);
    });
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--sidebar-bg)" }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {isPending && (
          <RefreshCw size={14} className="animate-spin" style={{ color: "var(--muted)" }} />
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Platform filter */}
        <select
          value={platform}
          onChange={(e) => navigate({ platform: e.target.value })}
          className="rounded-lg px-3 py-2 text-sm font-medium appearance-none cursor-pointer outline-none"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Date range */}
        <div className="relative">
          <button
            onClick={() => setShowPresets((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            <Calendar size={14} />
            {activePreset.label}
            <ChevronDown size={14} />
          </button>

          {showPresets && (
            <div
              className="absolute right-0 top-10 z-50 rounded-xl py-1 min-w-[180px] shadow-xl"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
              }}
            >
              {DATE_PRESETS.map((p) => (
                <button
                  key={p.days}
                  onClick={() => {
                    navigate({ days: String(p.days) });
                    setShowPresets(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/5"
                  style={{
                    color: p.days === currentDays ? "#a78bfa" : "var(--foreground)",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
