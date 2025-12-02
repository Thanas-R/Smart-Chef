interface MatchBadgeProps {
  relevanceScore: number;
}

export const MatchBadge = ({ relevanceScore }: MatchBadgeProps) => {
  const isHigh = relevanceScore >= 80;

  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
        isHigh
          ? "bg-success/10 text-success border-2 border-success/20"
          : "bg-primary/10 text-primary border-2 border-primary/20"
      }`}
    >
      {relevanceScore}% Relevance
    </div>
  );
};
