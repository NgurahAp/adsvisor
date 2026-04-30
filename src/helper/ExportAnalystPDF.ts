// lib/exportAnalysisPdf.ts

import jsPDF from "jspdf";
import { AnalysisData, DummyAnalysis } from "@/lib/types";
import { fmt, fmtRp, fmtDate } from "@/helper/fmt";

export async function exportAnalysisPdf(
  data: AnalysisData,
  aiAnalysis: DummyAnalysis | null,
  tsStr: string
): Promise<void> {
  const { fields, kpis } = data;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;
  const contentW = W - margin * 2;
  let y = 20;

  // ── Helpers ──────────────────────────────────────────────────────────────

  function setStyle(
    size: number,
    style: "normal" | "bold",
    color: [number, number, number]
  ) {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", style);
    pdf.setTextColor(...color);
  }

  function ln(gap = 6) {
    y += gap;
  }

  function checkPage(needed = 20) {
    if (y + needed > 277) {
      pdf.addPage();
      y = 20;
    }
  }

  function drawDivider() {
    pdf.setDrawColor(230, 230, 230);
    pdf.line(margin, y, W - margin, y);
    ln(8);
  }

  function drawSectionLabel(label: string) {
    setStyle(7, "bold", [180, 180, 180]);
    pdf.text(label, margin, y);
    ln(6);
  }

  // ── Header Bar ───────────────────────────────────────────────────────────

  pdf.setFillColor(230, 57, 70);
  pdf.rect(0, 0, W, 14, "F");
  setStyle(9, "bold", [255, 255, 255]);
  pdf.text("ADSVISOR — HASIL ANALISIS KAMPANYE", margin, 9);
  setStyle(9, "normal", [255, 255, 255]);
  pdf.text(tsStr, W - margin, 9, { align: "right" });
  y = 24;

  // ── Campaign Title ───────────────────────────────────────────────────────

  setStyle(18, "bold", [15, 15, 15]);
  pdf.text(fields.name || "Kampanye", margin, y);
  ln(7);

  setStyle(9, "normal", [120, 120, 120]);
  pdf.text(`Platform: ${fields.platform}`, margin, y);
  ln(5);

  if (fields.startDate || fields.endDate) {
    pdf.text(
      `Periode: ${fmtDate(fields.startDate)} – ${fmtDate(fields.endDate)}`,
      margin,
      y
    );
    ln(5);
  }

  ln(3);
  drawDivider();

  // ── Stats Row ────────────────────────────────────────────────────────────

  drawSectionLabel("RINGKASAN PERFORMA");

  const stats: [string, string][] = [
    ["Impressions", fmt(fields.impressions)],
    ["Clicks", fmt(fields.clicks)],
    ...(fields.conversions
      ? ([["Conversions", fmt(fields.conversions)]] as [string, string][])
      : []),
    ["Total Spend", fmtRp(fields.spend)],
  ];

  const statColW = contentW / stats.length;
  stats.forEach(([label, val], i) => {
    const x = margin + i * statColW;
    setStyle(7, "bold", [160, 160, 160]);
    pdf.text(label.toUpperCase(), x, y);
    setStyle(13, "bold", [20, 20, 20]);
    pdf.text(val, x, y + 7);
  });
  ln(18);

  // ── KPI Cards ────────────────────────────────────────────────────────────

  drawDivider();
  drawSectionLabel("KPI METRICS");

  const kpiItems: [string, string][] = [
    ["CTR", kpis.ctr !== null ? `${kpis.ctr}%` : "—"],
    ["CPC", kpis.cpc !== null ? fmtRp(kpis.cpc) : "—"],
    ["CPA", kpis.cpa !== null ? fmtRp(kpis.cpa) : "—"],
    ["ROAS", kpis.roas !== null ? `${kpis.roas}x` : "—"],
  ];

  const kpiColW = contentW / 4;
  kpiItems.forEach(([label, val], i) => {
    const x = margin + i * kpiColW;
    pdf.setFillColor(248, 249, 250);
    pdf.roundedRect(x, y - 3, kpiColW - 3, 18, 2, 2, "F");
    setStyle(7, "bold", [150, 150, 150]);
    pdf.text(label, x + 4, y + 3);
    setStyle(12, "bold", [20, 20, 20]);
    pdf.text(val, x + 4, y + 12);
  });
  ln(24);

  // ── AI Analysis ──────────────────────────────────────────────────────────

  if (aiAnalysis) {
    // Performance Summary
    checkPage(30);
    drawDivider();
    drawSectionLabel("PERFORMANCE SUMMARY");

    setStyle(9, "normal", [80, 80, 80]);
    const summaryLines = pdf.splitTextToSize(aiAnalysis.summary, contentW);
    pdf.text(summaryLines, margin, y);
    ln(summaryLines.length * 5 + 4);

    // What's Working
    checkPage(20);
    drawSectionLabel("WHAT'S WORKING");

    aiAnalysis.whatsWorking.forEach((item) => {
      checkPage(8);
      pdf.setFillColor(34, 197, 94);
      pdf.circle(margin + 1.5, y - 1.5, 1.5, "F");
      setStyle(9, "normal", [60, 60, 60]);
      const lines = pdf.splitTextToSize(item, contentW - 8);
      pdf.text(lines, margin + 6, y);
      ln(lines.length * 5 + 2);
    });
    ln(2);

    // Needs Attention
    checkPage(20);
    drawSectionLabel("NEEDS ATTENTION");

    aiAnalysis.needsAttention.forEach((item) => {
      checkPage(8);
      pdf.setFillColor(230, 57, 70);
      pdf.circle(margin + 1.5, y - 1.5, 1.5, "F");
      setStyle(9, "normal", [60, 60, 60]);
      const lines = pdf.splitTextToSize(item, contentW - 8);
      pdf.text(lines, margin + 6, y);
      ln(lines.length * 5 + 2);
    });
    ln(2);

    // Recommendations
    checkPage(20);
    drawSectionLabel("RECOMMENDATIONS");

    aiAnalysis.recommendations.forEach((item, i) => {
      checkPage(12);
      const lines = pdf.splitTextToSize(item, contentW - 14);
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, y - 4, contentW, lines.length * 5 + 6, 2, 2, "F");
      setStyle(8, "bold", [100, 100, 100]);
      pdf.text(`${i + 1}`, margin + 4, y + 1);
      setStyle(9, "normal", [50, 50, 50]);
      pdf.text(lines, margin + 12, y + 1);
      ln(lines.length * 5 + 8);
    });

    // Priority Today
    checkPage(20);
    pdf.setFillColor(20, 20, 20);
    pdf.roundedRect(margin, y, contentW, 20, 3, 3, "F");
    setStyle(7, "bold", [150, 150, 150]);
    pdf.text("PRIORITY TODAY", margin + 5, y + 7);
    setStyle(10, "bold", [255, 255, 255]);
    const priorityLines = pdf.splitTextToSize(
      aiAnalysis.priority,
      contentW - 10
    );
    pdf.text(priorityLines, margin + 5, y + 14);
    ln(24);
  }

  // ── Footer ───────────────────────────────────────────────────────────────

  const totalPages = (pdf.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    setStyle(7, "normal", [180, 180, 180]);
    pdf.text(`AdsVisor • Halaman ${i} dari ${totalPages}`, margin, 290);
    pdf.text("adsvisor.app", W - margin, 290, { align: "right" });
  }

  pdf.save(`adsvisor-${fields.name || "kampanye"}.pdf`);
}