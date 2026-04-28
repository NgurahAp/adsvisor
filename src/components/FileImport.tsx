"use client";
import { useState, useRef } from "react";
import { FileUp, X, Check, AlertTriangle } from "lucide-react";

export type CsvData = {
  impressions: string;
  clicks: string;
  conversions: string;
  spend: string;
  price: string;
};

const FIELD_LABELS: Record<keyof CsvData, string> = {
  impressions: "Impressions",
  clicks: "Clicks",
  conversions: "Conversions",
  spend: "Spend",
  price: "Harga",
};

type Props = {
  onImport: (data: Partial<CsvData>) => void;
};

export default function CsvImport({ onImport }: Props) {
  const [csvFile, setCsvFile] = useState<string | null>(null);
  const [csvMapped, setCsvMapped] = useState<Partial<CsvData>>({});
  const [csvWarn, setCsvWarn] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function parseCSV(text: string): Record<string, string> | null {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return null;
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const values = lines[1]
      .split(",")
      .map((v) => v.trim().replace(/[^0-9.]/g, ""));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  }

  function applyCSV(text: string, filename: string) {
    const data = parseCSV(text);
    if (!data) return;

    const mapped: Partial<CsvData> = {};
    const warn: string[] = [];

    (Object.keys(FIELD_LABELS) as (keyof CsvData)[]).forEach((key) => {
      const val = data[key] ?? "";
      if (val) mapped[key] = val;
      else warn.push(FIELD_LABELS[key]);
    });

    setCsvMapped(mapped);
    setCsvWarn(warn);
    setCsvFile(filename);
    onImport(mapped);
  }

  function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) return;
    const reader = new FileReader();
    reader.onload = (e) => applyCSV(e.target?.result as string, file.name);
    reader.readAsText(file);
  }

  function clearCsv() {
    setCsvFile(null);
    setCsvMapped({});
    setCsvWarn([]);
    if (fileRef.current) fileRef.current.value = "";
    onImport({});
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          <FileUp size={15} className="text-red-500" />
          Import dari CSV
        </h2>
        <span className="text-xs text-gray-300">
          Opsional — bisa isi manual di bawah
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Upload CSV untuk mengisi form secara otomatis.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {!csvFile ? (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]);
          }}
          className={`border border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-red-300 bg-red-50"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <FileUp size={22} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-400">
            Klik atau seret file CSV ke sini
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Format kolom: impressions, clicks, conversions, spend, price
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Check size={13} className="text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                {csvFile}
              </span>
            </div>
            <button
              onClick={clearCsv}
              className="text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.entries(csvMapped) as [keyof CsvData, string][]).map(
              ([k, v]) => (
                <div
                  key={k}
                  className="flex flex-col bg-white border border-gray-100 rounded-lg px-3 py-2 min-w-[80px]"
                >
                  <span className="text-xs text-gray-400">
                    {FIELD_LABELS[k]}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {Number(v).toLocaleString("id-ID")}
                  </span>
                </div>
              ),
            )}
          </div>

          {csvWarn.length > 0 && (
            <div className="flex items-start gap-2 mt-3 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
              <AlertTriangle
                size={13}
                className="text-yellow-500 mt-0.5 shrink-0"
              />
              <p className="text-xs text-yellow-600">
                Kolom tidak ditemukan: {csvWarn.join(", ")}. Isi manual ya.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
