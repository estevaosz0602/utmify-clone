"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { PLATFORM_LABELS, PLATFORM_COLORS } from "@/types/webhook";

interface Config {
  id: string;
  platform: string;
  secretToken: string;
  isActive: boolean;
}

interface Event {
  id: string;
  platform: string;
  eventType: string;
  status: string;
  error: string | null;
  createdAt: string;
}

interface Props {
  platforms: string[];
  configs: Config[];
  events: Event[];
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };
  return { copied, copy };
}

export function WebhookConfigPanel({ platforms, configs, events }: Props) {
  const { copied, copy } = useCopy();
  const [loading, setLoading] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://seudominio.com";

  const getConfig = (platform: string) =>
    configs.find((c) => c.platform === platform);

  const activate = async (platform: string, regenerate = false) => {
    setLoading(platform);
    try {
      const res = await fetch("/api/webhook-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, regenerate }),
      });
      const data = await res.json();
      setTokens((prev) => ({ ...prev, [platform]: data.secretToken }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const config = getConfig(platform);
          const token = tokens[platform] || config?.secretToken;
          const webhookUrl = `${appUrl}/api/webhook/${platform}`;
          const color = PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS] || "#64748b";
          const label = PLATFORM_LABELS[platform as keyof typeof PLATFORM_LABELS] || platform;

          return (
            <div
              key={platform}
              className="rounded-xl p-5 space-y-4"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: color }}
                  >
                    {label[0]}
                  </div>
                  <span className="font-semibold text-white">{label}</span>
                </div>
                <span
                  className="text-xs rounded-full px-2 py-0.5 font-medium"
                  style={{
                    background: config?.isActive ? "#10b98120" : "#64748b20",
                    color: config?.isActive ? "#10b981" : "#64748b",
                  }}
                >
                  {config?.isActive ? "Ativo" : "Inativo"}
                </span>
              </div>

              {/* Webhook URL */}
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
                  URL do Webhook
                </label>
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                >
                  <span className="flex-1 text-xs font-mono truncate" style={{ color: "#a78bfa" }}>
                    {webhookUrl}
                  </span>
                  <button
                    onClick={() => copy(webhookUrl, `url-${platform}`)}
                    className="flex-shrink-0 transition-colors"
                    style={{ color: "var(--muted)" }}
                  >
                    {copied === `url-${platform}` ? (
                      <Check size={13} style={{ color: "#10b981" }} />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>

              {/* Token */}
              {token && (
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
                    Token secreto
                  </label>
                  <div
                    className="flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                  >
                    <span className="flex-1 text-xs font-mono truncate" style={{ color: "var(--foreground)" }}>
                      {token}
                    </span>
                    <button
                      onClick={() => copy(token, `token-${platform}`)}
                      className="flex-shrink-0"
                      style={{ color: "var(--muted)" }}
                    >
                      {copied === `token-${platform}` ? (
                        <Check size={13} style={{ color: "#10b981" }} />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {!config ? (
                  <button
                    onClick={() => activate(platform)}
                    disabled={loading === platform}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-white transition-colors"
                    style={{ background: color }}
                  >
                    {loading === platform ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <Zap size={12} />
                    )}
                    Ativar Webhook
                  </button>
                ) : (
                  <button
                    onClick={() => activate(platform, true)}
                    disabled={loading === platform}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--muted)",
                    }}
                  >
                    {loading === platform ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <RefreshCw size={12} />
                    )}
                    Novo token
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event log */}
      <div
        className="rounded-xl"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold text-white">Log de eventos recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Plataforma", "Evento", "Status", "Erro", "Data"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs uppercase tracking-wider font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-sm" style={{ color: "var(--muted)" }}>
                    Nenhum evento registrado ainda.
                  </td>
                </tr>
              )}
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-white/[0.02]"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td className="px-5 py-3 capitalize font-medium text-white">
                    {PLATFORM_LABELS[event.platform as keyof typeof PLATFORM_LABELS] || event.platform}
                  </td>
                  <td className="px-5 py-3 text-xs font-mono" style={{ color: "var(--muted)" }}>
                    {event.eventType}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: event.status === "success" ? "#10b98120" : "#ef444420",
                        color: event.status === "success" ? "#10b981" : "#ef4444",
                      }}
                    >
                      {event.status === "success" ? (
                        <CheckCircle size={10} />
                      ) : (
                        <AlertCircle size={10} />
                      )}
                      {event.status === "success" ? "Sucesso" : "Erro"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs max-w-[200px] truncate" style={{ color: "#ef4444" }}>
                    {event.error || "—"}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--muted)" }}>
                    {new Date(event.createdAt).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
