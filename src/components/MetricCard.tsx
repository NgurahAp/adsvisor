interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isUp?: boolean;
  isStable?: boolean;
}

export const MetricCard = ({
  title,
  value,
  change,
  isUp,
  isStable,
}: MetricCardProps) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">
      {title}
    </p>
    <div className="flex items-center justify-between">
      <span className="text-xl font-black text-slate-800">{value}</span>
      {isUp && (
        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">
          ↑ {change}
        </span>
      )}
      {isStable && (
        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
          {change}
        </span>
      )}
    </div>
  </div>
);
