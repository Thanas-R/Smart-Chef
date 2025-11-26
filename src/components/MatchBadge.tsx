interface MatchBadgeProps {
  percentage: number;
}

export const MatchBadge = ({ percentage }: MatchBadgeProps) => {
  const isHighMatch = percentage >= 80;
  
  return (
    <div
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
        isHighMatch
          ? "bg-success/20 text-success"
          : "bg-warning/20 text-warning"
      }`}
    >
      {percentage}% Match
    </div>
  );
};
