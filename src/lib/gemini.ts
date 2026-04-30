import type { CampaignFields, KPIResult, DummyAnalysis } from "@/lib/types";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

function buildPrompt(fields: CampaignFields, kpis: KPIResult): string {
  return `Kamu adalah AI marketing analyst. Analisis performa kampanye iklan berikut dan berikan insight yang actionable dalam Bahasa Indonesia.

DATA KAMPANYE:
- Nama: ${fields.name || "Untitled"}
- Platform: ${fields.platform}
- Periode: ${fields.startDate || "?"} s/d ${fields.endDate || "?"}
- Impressions: ${fields.impressions}
- Clicks: ${fields.clicks}
- Conversions: ${fields.conversions || 0}
- Total Spend: Rp ${Number(fields.spend).toLocaleString("id-ID")}
- Harga Produk: ${fields.price ? `Rp ${Number(fields.price).toLocaleString("id-ID")}` : "Tidak diisi"}

KPI HASIL KALKULASI:
- CTR: ${kpis.ctr !== null ? `${kpis.ctr}%` : "N/A"}
- CPC: ${kpis.cpc !== null ? `Rp ${kpis.cpc.toLocaleString("id-ID")}` : "N/A"}
- CPA: ${kpis.cpa !== null ? `Rp ${kpis.cpa.toLocaleString("id-ID")}` : "N/A"}
- ROAS: ${kpis.roas !== null ? `${kpis.roas}x` : "N/A"}

Berikan analisis dalam format JSON berikut (HANYA JSON, tanpa markdown atau teks lain):
{
  "summary": "ringkasan performa kampanye dalam 2-3 kalimat",
  "whatsWorking": ["item 1", "item 2", "item 3"],
  "needsAttention": ["item 1", "item 2", "item 3"],
  "recommendations": ["rekomendasi 1", "rekomendasi 2", "rekomendasi 3"],
  "priority": "satu kalimat prioritas utama yang harus dilakukan sekarang"
}`;
}

export async function analyzeWithGemini(
  fields: CampaignFields,
  kpis: KPIResult,
): Promise<DummyAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY tidak ditemukan di environment variables.");
  }

  const prompt = buildPrompt(fields, kpis);

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();

  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!rawText) {
    throw new Error("Gemini tidak mengembalikan teks.");
  }

  // Strip markdown code fences jika ada
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  const parsed: DummyAnalysis = JSON.parse(cleaned);

  return parsed;
}
