"use client";

import { useState } from "react";
import DashboardPage from "./Components/DashboardPage";
import { ResultPage } from "./Components/ResultPage";

export default function AdvisorApp() {
  const [view, setView] = useState<"dashboard" | "result">("dashboard");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  return (
    <div className="min-h-screen font-sans">
      {view === "dashboard" ? (
        <DashboardPage
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
