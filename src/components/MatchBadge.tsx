interface MatchBadgeProps {
  percentage: number;
}

export const MatchBadge = ({ percentage }: MatchBadgeProps) => {
  // Color thresholds: green for high (80+), yellow for medium (50-79), red for low (<50)
  const getMatchColor = () => {
    if (percentage >= 80) {
      return "bg-green-500/10 text-green-600 border-2 border-green-500/20";
    } else if (percentage >= 50) {
      return "bg-yellow-500/10 text-yellow-600 border-2 border-yellow-500/20";
    } else {
      return "bg-red-500/10 text-red-600 border-2 border-red-500/20";
    }
  };
  
  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm ${getMatchColor()}`}
    >
      {percentage}% Match
    </div>
  );
};
