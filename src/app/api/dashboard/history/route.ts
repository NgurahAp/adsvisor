import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { Platform } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type {
  SortOption,
  RangeOption,
  CampaignStatus,
  HistoryCampaign,
  HistoryMeta,
  HistoryResponse,
  HistoryApiResponse,
  MetricItem,
} from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const ENUM_TO_PLATFORM_LABEL: Record<Platform, string> = {
  [Platform.facebook]: "Facebook Ads",
  [Platform.google]: "Google Ads",
  [Platform.tiktok]: "TikTok Ads",
  [Platform.instagram]: "Instagram Ads",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveStatus(
  ctr: number,
  roas: number | null,
): CampaignStatus {
  if (roas !== null && roas < 1) return "critical";
  if (ctr < 0.5 || (roas !== null && roas < 2)) return "warning";
  return "on-track";
}

function buildInsight(
  ctr: number,
  roas: number | null,
  cpc: number,
  cpa: number,
): string {
  if (roas !== null && roas < 1) {
    return "ROAS di bawah 1x — segera evaluasi targeting dan landing page.";
  }
  if (ctr < 0.5) {
    return "CTR sangat rendah. Pertimbangkan refresh creative dan copy iklan.";
  }
  if (roas !== null && roas < 2) {
    return `ROAS ${roas.toFixed(1)}x masih bisa ditingkatkan dengan optimasi audience.`;
  }
  if (cpa > 0 && cpc > 0 && cpa / cpc > 10) {
    return "Funnel konversi perlu dioptimalkan — jarak CPC ke CPA terlalu jauh.";
  }
  if (roas !== null && roas >= 3) {
    return `Performa solid dengan ROAS ${roas.toFixed(1)}x. Pertahankan strategi ini.`;
  }
  return "Monitor tren harian untuk menjaga performa tetap stabil.";
}

function formatDateId(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toNumberSafe(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Auth
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const verified = verifyJwt(token);
  if (!verified || typeof verified === "string" || !("userId" in verified)) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const userId = BigInt(verified.userId as string);

  // Query params
  const { searchParams } = new URL(req.url);
  const sortParam = (searchParams.get("sort") ?? "newest") as SortOption;
  const rangeParam = (searchParams.get("range") ?? "30") as RangeOption;
  const platformParam = searchParams.get("platform"); // e.g. "google" | null

  const validSorts: SortOption[] = ["newest", "oldest", "roi_highest"];
  const validRanges: RangeOption[] = ["7", "30", "90"];
  const sort: SortOption = validSorts.includes(sortParam)
    ? sortParam
    : "newest";
  const rangeDays: number = validRanges.includes(rangeParam)
    ? parseInt(rangeParam)
    : 30;

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - rangeDays);

  // Validate platform filter
  const platformEnumValues = Object.values(Platform) as string[];
  const platformFilter =
    platformParam && platformEnumValues.includes(platformParam)
      ? (platformParam as Platform)
      : undefined;

  // DB query — join campaigns with their latest analysis
  const campaigns = await prisma.campaign.findMany({
    where: {
      user_id: userId,
      created_at: { gte: sinceDate },
      ...(platformFilter ? { platform: platformFilter } : {}),
    },
    include: {
      analyses: {
        orderBy: { created_at: "desc" },
        take: 1,
      },
    },
    orderBy:
      sort === "oldest"
        ? { created_at: "asc" }
        : sort === "roi_highest"
          ? { analyses: { _count: "desc" } } // fallback; real sort is in-memory
          : { created_at: "desc" },
  });

  // Shape response
  const shaped: HistoryCampaign[] = campaigns.map((campaign) => {
    const analysis = campaign.analyses[0] ?? null;

    const ctr = analysis ? toNumberSafe(analysis.ctr) : 0;
    const cpc = analysis ? toNumberSafe(analysis.cpc) : 0;
    const cpa = analysis ? toNumberSafe(analysis.cpa) : 0;
    const roas = analysis?.roas != null ? toNumberSafe(analysis.roas) : null;

    const impressions = Number(campaign.impressions);
    const clicks = Number(campaign.clicks);
    const conversions = Number(campaign.conversions);
    const spend = toNumberSafe(campaign.total_spend);

    // Build metric rows for the card UI
    const isPlatformTikTok = campaign.platform === Platform.tiktok;
    const metrics: MetricItem[] = isPlatformTikTok
      ? [
          { label: "Views", value: impressions.toLocaleString("id-ID") },
          {
            label: "Completion",
            value:
              impressions > 0
                ? `${((clicks / impressions) * 100).toFixed(0)}%`
                : "0%",
          },
          { label: "Installs", value: conversions.toLocaleString("id-ID") },
          {
            label: "CPI",
            value:
              conversions > 0
                ? `Rp ${Math.round(spend / conversions).toLocaleString("id-ID")}`
                : "—",
          },
        ]
      : [
          { label: "Reach", value: impressions.toLocaleString("id-ID") },
          { label: "CTR", value: `${ctr.toFixed(2)}%` },
          { label: "Conversion", value: conversions.toLocaleString("id-ID") },
          {
            label: "ROI",
            value: roas !== null ? `${roas.toFixed(1)}x` : "—",
          },
        ];

    return {
      id: campaign.id.toString(),
      name: campaign.campaign_name,
      platform: ENUM_TO_PLATFORM_LABEL[campaign.platform],
      status: deriveStatus(ctr, roas),
      startDate: formatDateId(campaign.date_start),
      endDate: formatDateId(campaign.date_end),
      createdAt: campaign.created_at.toISOString(),
      metrics,
      kpis: {
        ctr: analysis ? ctr.toFixed(2) : null,
        cpc: analysis ? Math.round(cpc) : null,
        cpa: analysis ? Math.round(cpa) : null,
        roas: roas !== null ? roas.toFixed(1) : null,
      },
      insight: buildInsight(ctr, roas, cpc, cpa),
    };
  });

  // In-memory sort for roi_highest (Prisma can't sort by related aggregate easily)
  if (sort === "roi_highest") {
    shaped.sort((a, b) => {
      const roaA = a.kpis.roas !== null ? Number(a.kpis.roas) : -Infinity;
      const roaB = b.kpis.roas !== null ? Number(b.kpis.roas) : -Infinity;
      return roaB - roaA;
    });
  }

  // Meta stats — aggregate across all user campaigns (not filtered)
  const [allCampaigns, allAnalyses] = await Promise.all([
    prisma.campaign.aggregate({
      where: { user_id: userId },
      _count: { id: true },
      _sum: { total_spend: true },
    }),
    prisma.analysis.aggregate({
      where: { user_id: userId, roas: { not: null } },
      _avg: { roas: true },
      _count: { id: true },
    }),
  ]);

  const totalAnalisis = allCampaigns._count.id;
  const anggaranTerkelola = toNumberSafe(allCampaigns._sum.total_spend);
  const avgROI =
    allAnalyses._avg.roas != null
      ? Number(Number(allAnalyses._avg.roas).toFixed(1))
      : null;

  // efisiensiAI: ratio of campaigns that have analysis vs total
  const efisiensiAI =
    totalAnalisis > 0
      ? Math.round((allAnalyses._count.id / totalAnalisis) * 100)
      : 0;

  const meta: HistoryMeta = {
    totalAnalisis,
    avgROI,
    anggaranTerkelola: Math.round(anggaranTerkelola),
    efisiensiAI,
  };

  const response: HistoryApiResponse = {
    success: true,
    data: {
      campaigns: shaped,
      meta,
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 200 });
}
