import { Suspense } from "react";
import { Topbar } from "@/components/layout/topbar";
import { WebhookConfigPanel } from "@/components/webhooks/webhook-config-panel";
import { prisma } from "@/lib/prisma";
import { PLATFORMS } from "@/types/webhook";

export const dynamic = "force-dynamic";

export default async function WebhooksPage() {
  const configs = await prisma.webhookConfig.findMany();
  const recentEvents = await prisma.webhookEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={null}>
        <Topbar title="Webhooks" />
      </Suspense>

      <div className="p-6 space-y-6">
        <div
          className="rounded-xl p-4"
          style={{ background: "#7c3aed15", border: "1px solid #7c3aed40" }}
        >
          <p className="text-sm" style={{ color: "#a78bfa" }}>
            <strong>Como funciona:</strong> Copie a URL do webhook da sua plataforma e cole no
            painel dela. Cada plataforma tem uma URL única. Os dados de UTM das suas vendas serão
            automaticamente capturados.
          </p>
        </div>

        <WebhookConfigPanel
          platforms={PLATFORMS}
          configs={configs.map((c: (typeof configs)[number]) => ({ ...c, secretToken: c.secretToken.slice(0, 8) + "••••••••" }))}
          events={recentEvents.map((e: (typeof recentEvents)[number]) => ({ ...e, createdAt: e.createdAt.toISOString() }))}
        />
      </div>
    </div>
  );
}
