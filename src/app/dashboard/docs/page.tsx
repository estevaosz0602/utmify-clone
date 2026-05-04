import { Suspense } from "react";
import { Topbar } from "@/components/layout/topbar";

const platforms = [
  {
    id: "hotmart",
    name: "Hotmart",
    color: "#ff4d00",
    auth: "Header `x-hotmart-webhook-token`",
    utmNote: "UTMs em `data.purchase.tracking.utm_*`. O campo `source_sck` é mapeado para utm_source como fallback.",
    sampleEvent: "PURCHASE_COMPLETE",
    samplePayload: `{
  "event": "PURCHASE_COMPLETE",
  "data": {
    "purchase": {
      "transaction": "HP12345678",
      "price": { "value": 197.00, "currency_value": "BRL" },
      "tracking": {
        "utm_source": "facebook",
        "utm_medium": "cpc",
        "utm_campaign": "lançamento-2026",
        "source_sck": "facebook"
      }
    },
    "buyer": { "name": "João Silva", "email": "joao@email.com" },
    "product": { "name": "Curso Avançado de Marketing" }
  }
}`,
  },
  {
    id: "kiwify",
    name: "Kiwify",
    color: "#6c47ff",
    auth: "HMAC-SHA1 no query param `?signature=`",
    utmNote: "UTMs nativos em `tracking_parameters.utm_*`. Kiwify passa UTMs automaticamente.",
    sampleEvent: "paid",
    samplePayload: `{
  "order_id": "KW_ABC123",
  "order_status": "paid",
  "order_total": 297.00,
  "Customer": { "full_name": "Maria Santos", "email": "maria@email.com" },
  "Product": { "name": "Mentoria Premium" },
  "tracking_parameters": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "search-brand"
  }
}`,
  },
  {
    id: "eduzz",
    name: "Eduzz",
    color: "#0070f3",
    auth: "Campo `api_key` no body",
    utmNote: "UTMs customizados em `uv_utm_*`. Você precisa passar os UTMs manualmente pela URL do produto.",
    sampleEvent: "trans_status: 3",
    samplePayload: `{
  "api_key": "seu_token_aqui",
  "trans_cod": 99887766,
  "trans_status": 3,
  "trans_value": 197.00,
  "prod_name": "Ebook Completo",
  "cli_nome": "Pedro Costa",
  "cli_email": "pedro@email.com",
  "uv_utm_source": "youtube",
  "uv_utm_medium": "video",
  "uv_utm_campaign": "tutorial-gratis"
}`,
  },
  {
    id: "ticto",
    name: "Ticto",
    color: "#00c46a",
    auth: "HMAC-SHA256 no header `X-Ticto-Signature`",
    utmNote: "UTMs em `data.metadata.utm_*`.",
    sampleEvent: "purchase_approved",
    samplePayload: `{
  "event": "purchase_approved",
  "data": {
    "id": "ticto_order_123",
    "amount": 19700,
    "customer": { "name": "Ana Lima", "email": "ana@email.com" },
    "product": { "name": "Workshop Online" },
    "metadata": {
      "utm_source": "instagram",
      "utm_medium": "stories",
      "utm_campaign": "black-friday"
    }
  }
}`,
  },
  {
    id: "perfectpay",
    name: "PerfectPay",
    color: "#ff6b35",
    auth: "Campo `token` no body",
    utmNote: "UTMs em objeto `utm_data`.",
    sampleEvent: "approved",
    samplePayload: `{
  "token": "seu_token_aqui",
  "sale_id": "PP_XYZ789",
  "sale_status": "approved",
  "sale_amount": 497.00,
  "product_name": "Imersão Completa",
  "customer": { "name": "Carlos Mendes", "email": "carlos@email.com" },
  "utm_data": {
    "utm_source": "tiktok",
    "utm_medium": "paid",
    "utm_campaign": "lancamento-q2"
  }
}`,
  },
];

export default function DocsPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seudominio.com";

  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={null}>
        <Topbar title="Documentação da API" />
      </Suspense>

      <div className="p-6 space-y-6 max-w-4xl">
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-base font-semibold text-white mb-2">Integração via Webhook</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Cada plataforma tem uma URL de webhook única. Cadastre essa URL no painel da sua
            plataforma de vendas para começar a receber dados de pedidos automaticamente.
            Os UTMs são capturados e atribuídos a cada venda.
          </p>
        </div>

        {platforms.map((p) => (
          <div
            key={p.id}
            className="rounded-xl overflow-hidden"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ borderBottom: "1px solid var(--border)", borderLeft: `4px solid ${p.color}` }}
            >
              <div
                className="h-7 w-7 rounded flex items-center justify-center text-xs font-bold text-white"
                style={{ background: p.color }}
              >
                {p.name[0]}
              </div>
              <h3 className="text-sm font-semibold text-white">{p.name}</h3>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>URL do Webhook</p>
                <code
                  className="block rounded-lg px-3 py-2 text-xs font-mono"
                  style={{ background: "var(--background)", color: "#a78bfa" }}
                >
                  POST {appUrl}/api/webhook/{p.id}
                </code>
              </div>

              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>Autenticação</p>
                <p className="text-sm" style={{ color: "var(--foreground)" }}>{p.auth}</p>
              </div>

              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>Rastreamento UTM</p>
                <p className="text-sm" style={{ color: "var(--foreground)" }}>{p.utmNote}</p>
              </div>

              <div>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
                  Exemplo de payload ({p.sampleEvent})
                </p>
                <pre
                  className="rounded-lg p-4 text-xs overflow-x-auto leading-relaxed"
                  style={{ background: "var(--background)", color: "#94a3b8" }}
                >
                  {p.samplePayload}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
