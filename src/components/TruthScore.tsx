
import { TruthLevel } from "@/types";
import { cn } from "@/lib/utils";

interface TruthScoreProps {
  score: number;
  truthLevel: TruthLevel;
}

export function TruthScore({ score, truthLevel }: TruthScoreProps) {
  // Calculate the position of the marker on the gradient (0-100%)
  const markerPosition = `${score}%`;
  
  // Determine the badge color based on the truth level
  const getBadgeColor = () => {
    switch (truthLevel) {
      case "True":
        return "bg-truth-true";
      case "Likely True":
        return "bg-truth-likelyTrue";
      case "Misleading":
        return "bg-truth-misleading";
      case "Fake":
        return "bg-truth-fake";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Truth Score</h3>
        <div className={cn("px-3 py-1 rounded-full text-white text-sm font-medium", getBadgeColor())}>
          {truthLevel}
        </div>
      </div>
      
      <div className="relative pt-1">
        <div className="gradient-truth-score">
          <div
            className="truth-meter-marker"
            style={{ 
              left: markerPosition,
              backgroundColor: truthLevel === "True" ? "#4ade80" : 
                              truthLevel === "Likely True" ? "#22d3ee" : 
                              truthLevel === "Misleading" ? "#fbbf24" : "#f87171"
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span>0</span>
          <span>Truth Score: {score}</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
