import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { Platform } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, AnalysisData } from "@/lib/types";

const ENUM_TO_PLATFORM_LABEL: Record<Platform, string> = {
  [Platform.facebook]: "Facebook Ads",
  [Platform.google]: "Google Ads",
  [Platform.tiktok]: "TikTok Ads",
  [Platform.instagram]: "Instagram Ads",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const verified = verifyJwt(token);
  if (!verified || typeof verified === "string" || !("userId" in verified)) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const userId = BigInt(verified.userId as string);
  const { id } = await params;
  const campaignId = BigInt(id);

  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
      user_id: userId,
    },
    include: {
      analyses: {
        orderBy: { created_at: "desc" },
        take: 1,
      },
    },
  });

  if (!campaign) {
    return NextResponse.json(
      { message: "Campaign not found" },
      { status: 404 },
    );
  }

  const analysis = campaign.analyses[0];
  if (!analysis) {
    return NextResponse.json(
      { message: "Analysis not found" },
      { status: 404 },
    );
  }

  const aiAnalysis =
    typeof analysis.ai_analysis === "string"
      ? JSON.parse(analysis.ai_analysis)
      : analysis.ai_analysis;

  const response: ApiResponse<AnalysisData> = {
    success: true,
    data: {
      fields: {
        name: campaign.campaign_name,
        platform: ENUM_TO_PLATFORM_LABEL[campaign.platform],
        startDate: campaign.date_start.toISOString(),
        endDate: campaign.date_end.toISOString(),
        impressions: campaign.impressions.toString(),
        clicks: campaign.clicks.toString(),
        conversions: campaign.conversions.toString(),
        spend: campaign.total_spend.toString(),
        price: campaign.product_price?.toString() || "0",
      },
      kpis: {
        ctr: analysis.ctr.toString(),
        cpc: analysis.cpc,
        cpa: analysis.cpa,
        roas: analysis.roas?.toString() || null,
      },
      analysis: aiAnalysis,
      timestamp: campaign.created_at.toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
