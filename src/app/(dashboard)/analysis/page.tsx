"use client";

import { useState } from "react";
import type { AnalysisData } from "@/lib/types";
import FormPage from "../../../components/FormPage";
import { ResultPage } from "@/components/ResultPage";

export default function AdvisorApp() {
  const [view, setView] = useState<"dashboard" | "result">("dashboard");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  return (
    <div className="min-h-screen font-sans">
      {view === "dashboard" ? (
        <FormPage
          onAnalyze={(data) => {
            setAnalysisData(data);
            setView("result");
          }}
        />
      ) : (
        <ResultPage data={analysisData} onNew={() => setView("dashboard")} />
      )}
    </div>
  );
}
