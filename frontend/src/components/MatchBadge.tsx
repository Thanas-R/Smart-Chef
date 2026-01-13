interface MatchBadgeProps {
  relevance: number;
}

export const MatchBadge = ({ relevance }: MatchBadgeProps) => {
  const pct = Math.max(0, Math.min(100, Math.round(relevance || 0)));
  const isHighMatch = pct >= 80;
  
  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
        isHighMatch
          ? "bg-success/10 text-success border-2 border-success/20"
          : "bg-primary/10 text-primary border-2 border-primary/20"
      }`}
    >
      {pct}% Relevance
    </div>
  );
};
