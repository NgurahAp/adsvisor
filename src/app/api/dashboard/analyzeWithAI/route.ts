import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { CampaignFields, KPIResult, DummyAnalysis } from "@/lib/types";
import { analyzeWithGemini } from "@/lib/gemini";

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
  const analysisId: string = body?.analysisId;
  const fields: CampaignFields = body?.fields;
  const kpis: KPIResult = body?.kpis;

  if (!analysisId || !fields || !kpis) {
    return NextResponse.json(
      { message: "analysisId, fields, dan kpis wajib diisi." },
      { status: 400 },
    );
  }

  // Pastikan analysis milik user ini
  const userId = BigInt(verified.userId as string);
  const existing = await prisma.analysis.findFirst({
    where: { id: BigInt(analysisId), user_id: userId },
  });

  if (!existing) {
    return NextResponse.json(
      { message: "Analysis tidak ditemukan." },
      { status: 404 },
    );
  }

  // Panggil Gemini, fallback jika gagal
  let aiResult: DummyAnalysis;
  let usedFallback = false;

  try {
    aiResult = await analyzeWithGemini(fields, kpis);
  } catch (err) {
    console.error("[Gemini] Error, pakai fallback:", err);
    aiResult = null as any;
    usedFallback = true;
  }

  // Update ai_analysis di DB
  await prisma.analysis.update({
    where: { id: BigInt(analysisId) },
    data: { ai_analysis: JSON.stringify(aiResult) },
  });

  return NextResponse.json({
    success: true,
    usedFallback,
    data: { analysis: aiResult },
    timestamp: new Date().toISOString(),
  });
}
