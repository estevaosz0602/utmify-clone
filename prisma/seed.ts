import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { subDays, addHours } from "date-fns";

const url = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString: url });
const prisma = new PrismaClient({ adapter } as any);

const PLATFORMS = ["hotmart", "kiwify", "eduzz", "ticto", "perfectpay"];
const UTM_SOURCES = ["facebook", "google", "instagram", "youtube", "tiktok", "organic", null];
const UTM_MEDIUMS = ["cpc", "cpm", "email", "social", "video", null];
const UTM_CAMPAIGNS = ["lancamento-2026", "black-friday", "evergreen-produto", "remarketing", "black-week", null];
const PRODUCTS = [
  "Curso Avançado de Marketing Digital",
  "Mentoria Premium 3 meses",
  "Ebook: Tráfego Pago do Zero",
  "Workshop Online ao Vivo",
  "Imersão Completa",
];
const NAMES = ["João Silva", "Maria Santos", "Pedro Costa", "Ana Lima", "Carlos Mendes", "Fernanda Rocha", "Lucas Oliveira", "Beatriz Souza"];
const STATUSES = ["approved", "approved", "approved", "approved", "approved", "refunded", "pending"];
const AMOUNTS = [9700, 19700, 29700, 49700, 97000, 14700, 39700];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Seeding database...");

  await prisma.order.deleteMany();
  await prisma.webhookEvent.deleteMany();

  const orders = [];
  for (let i = 0; i < 300; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = addHours(subDays(new Date(), daysAgo), Math.floor(Math.random() * 24));

    orders.push({
      externalId: `SEED_${i}_${Date.now()}`,
      platform: rand(PLATFORMS),
      status: rand(STATUSES),
      amount: rand(AMOUNTS),
      currency: "BRL",
      productName: rand(PRODUCTS),
      customerEmail: `user${i}@example.com`,
      customerName: rand(NAMES),
      utmSource: rand(UTM_SOURCES) as string | null,
      utmMedium: rand(UTM_MEDIUMS) as string | null,
      utmCampaign: rand(UTM_CAMPAIGNS) as string | null,
      utmContent: null,
      utmTerm: null,
      rawPayload: "{}",
      createdAt,
      updatedAt: createdAt,
    });
  }

  await prisma.order.createMany({ data: orders });

  console.log(`✅ Created ${orders.length} orders`);

  for (const platform of PLATFORMS) {
    await prisma.webhookConfig.upsert({
      where: { platform },
      update: {},
      create: {
        platform,
        secretToken: Buffer.from(`${platform}-secret-${Date.now()}`).toString("hex"),
        isActive: true,
      },
    });
  }
  console.log("✅ Created webhook configs");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
