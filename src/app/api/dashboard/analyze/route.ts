import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { Platform } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type {
  CampaignFields,
  KPIResult,
  DummyAnalysis,
  AnalyzeResponse,
} from "@/lib/types";

const PLATFORM_TO_ENUM: Record<string, Platform> = {
  "Facebook Ads": Platform.facebook,
  "Google Ads": Platform.google,
  "TikTok Ads": Platform.tiktok,
  "Instagram Ads": Platform.instagram,
};

const ENUM_TO_PLATFORM_LABEL: Record<Platform, string> = {
  [Platform.facebook]: "Facebook Ads",
  [Platform.google]: "Google Ads",
  [Platform.tiktok]: "TikTok Ads",
  [Platform.instagram]: "Instagram Ads",
};

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toFixedNumber(value: number, digits: number): number {
  return Number(value.toFixed(digits));
}

function computeKpis(fields: CampaignFields): KPIResult {
  const impressions = toNumber(fields.impressions);
  const clicks = toNumber(fields.clicks);
  const conversions = toNumber(fields.conversions);
  const spend = toNumber(fields.spend);
  const price = toNumber(fields.price);

  const ctr =
    impressions > 0 ? toFixedNumber((clicks / impressions) * 100, 2).toFixed(2) : null;
  const cpc = clicks > 0 ? Math.round(spend / clicks) : null;
  const cpa = conversions > 0 ? Math.round(spend / conversions) : null;
  const revenue = conversions * price;
  const roas =
    spend > 0 && revenue > 0 ? toFixedNumber(revenue / spend, 2).toFixed(1) : null;

  return { ctr, cpc, cpa, roas };
}

function buildBasicAnalysis(kpis: KPIResult): DummyAnalysis {
  const roasValue = kpis.roas !== null ? Number(kpis.roas) : null;
  const ctrValue = kpis.ctr !== null ? Number(kpis.ctr) : null;

  const roasSummary =
    roasValue === null
      ? "ROAS belum tersedia karena harga produk atau konversi belum diisi."
      : roasValue >= 3
        ? `ROAS ${kpis.roas}x menunjukkan kampanye sudah menghasilkan return yang sehat.`
        : `ROAS ${kpis.roas}x masih bisa ditingkatkan dengan optimasi targeting dan kreatif.`;

  const ctrSummary =
    ctrValue === null
      ? "CTR belum tersedia."
      : ctrValue >= 1.5
        ? `CTR ${kpis.ctr}% sudah cukup baik untuk menjaga traffic tetap stabil.`
        : `CTR ${kpis.ctr}% masih relatif rendah dan butuh evaluasi pesan iklan.`;

  return {
    summary: `${roasSummary} ${ctrSummary}`,
    whatsWorking: [
      "Data campaign sudah tersimpan otomatis ke database.",
      "Metrik inti (CTR, CPC, CPA, ROAS) sudah dihitung dari data aktual.",
      "Format hasil siap dipakai untuk analisis AI lanjutan.",
    ],
    needsAttention: [
      "Insight AI detail belum diaktifkan pada tahap ini.",
      "Pastikan data conversion dan harga produk terisi agar ROAS lebih akurat.",
      "Lakukan monitoring performa antar periode untuk melihat tren.",
    ],
    recommendations: [
      "Pertahankan creative dengan CTR tertinggi.",
      "Uji A/B audience untuk menurunkan CPC dan CPA.",
      "Optimalkan funnel landing page agar conversion rate naik.",
    ],
    priority: "Fokus pada peningkatan konversi untuk mendorong ROAS ke atas 3x.",
  };
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const verified = verifyJwt(token);
  if (!verified || typeof verified === "string" || !("userId" in verified)) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const fields: CampaignFields = body?.fields;

  if (!fields?.impressions || !fields?.clicks || !fields?.spend) {
    return NextResponse.json(
      { message: "Impressions, Clicks, dan Spend wajib diisi." },
      { status: 400 },
    );
  }

  const platform = PLATFORM_TO_ENUM[fields.platform] ?? Platform.facebook;
  const kpis = computeKpis(fields);
  const analysisText = buildBasicAnalysis(kpis);
  const userId = BigInt(verified.userId as string);

  const impressions = Math.max(0, Math.round(toNumber(fields.impressions)));
  const clicks = Math.max(0, Math.round(toNumber(fields.clicks)));
  const conversions = Math.max(0, Math.round(toNumber(fields.conversions)));
  const spend = Math.max(0, toFixedNumber(toNumber(fields.spend), 2));
  const priceRaw = toNumber(fields.price);
  const productPrice = priceRaw > 0 ? toFixedNumber(priceRaw, 2) : null;
  const startDate = fields.startDate ? new Date(fields.startDate) : new Date();
  const endDate = fields.endDate ? new Date(fields.endDate) : startDate;

  const created = await prisma.$transaction(async (tx) => {
    const campaign = await tx.campaign.create({
      data: {
        user_id: userId,
        campaign_name: fields.name || "Untitled Campaign",
        platform,
        impressions: BigInt(impressions),
        clicks: BigInt(clicks),
        conversions: BigInt(conversions),
        total_spend: spend,
        product_price: productPrice,
        date_start: startDate,
        date_end: endDate,
      },
    });

    const analysis = await tx.analysis.create({
      data: {
        user_id: userId,
        campaign_id: campaign.id,
        ctr: kpis.ctr !== null ? Number(kpis.ctr) : 0,
        cpc: kpis.cpc ?? 0,
        cpa: kpis.cpa ?? 0,
        roas: kpis.roas !== null ? Number(kpis.roas) : null,
        ai_analysis: JSON.stringify(analysisText),
      },
    });

    return { campaign, analysis };
  });

  const response: AnalyzeResponse = {
    success: true,
    data: {
      analysisId: created.analysis.id.toString(),
      fields: {
        ...fields,
        platform: ENUM_TO_PLATFORM_LABEL[platform],
        name: created.campaign.campaign_name,
      },
      kpis,
      analysis: analysisText,
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
