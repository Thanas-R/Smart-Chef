interface MatchBadgeProps {
  percentage: number;
}

export const MatchBadge = ({ percentage }: MatchBadgeProps) => {
  const isHighMatch = percentage >= 80;
  
  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
        isHighMatch
          ? "bg-success/10 text-success border-2 border-success/20"
          : "bg-primary/10 text-primary border-2 border-primary/20"
      }`}
    >
      {percentage}% Match
    </div>
  );
};
