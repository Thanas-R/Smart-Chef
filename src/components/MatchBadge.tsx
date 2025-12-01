// MatchBadge.tsx
interface MatchBadgeProps {
  percentage: number | undefined | null;
}

export const MatchBadge = ({ percentage }: MatchBadgeProps) => {
  // Normalize to integer 0-100
  const toPct = (p: any) => {
    if (p === null || p === undefined) return 0;
    const n = Number(p);
    if (Number.isNaN(n)) return 0;
    // If the backend accidentally sent 0-1 float, scale it
    const scaled = n <= 1 ? Math.round(n * 100) : Math.round(n);
    return Math.min(100, Math.max(0, scaled));
  };

  const pct = toPct(percentage);
  const isHighMatch = pct >= 80;

  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
        isHighMatch
          ? "bg-success/10 text-success border-2 border-success/20"
          : "bg-primary/10 text-primary border-2 border-primary/20"
      }`}
      aria-label={`Match ${pct} percent`}
      title={`${pct}% match`}
    >
      {pct}% Match
    </div>
  );
};
