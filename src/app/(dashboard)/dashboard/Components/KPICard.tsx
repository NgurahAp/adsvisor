import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface KPICardProps {
  title: string;
  value: string | number | null | undefined;
  suffix?: string;
  badge?: string;
  badgeUp?: boolean;
  delay?: number;
}

export default function KPICard({
  title,
  value,
  suffix,
  badge,
  badgeUp,
  delay = 0,
}: KPICardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`bg-white border border-gray-100 rounded-xl p-4 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        {badge && (
          <span
            className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
              badgeUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {badgeUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {badge}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 tracking-tight">
        {value !== null && value !== undefined ? (
          `${value}${suffix ?? ""}`
        ) : (
          <span className="text-sm text-gray-300">N/A</span>
        )}
      </div>
    </div>
  );
}
