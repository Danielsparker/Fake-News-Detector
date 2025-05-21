
import { TruthLevel } from "@/types";
import { cn } from "@/lib/utils";
import { Shield, ShieldCheck, ShieldX } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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

  const getTextColor = () => {
    switch (truthLevel) {
      case "True":
        return "text-truth-true";
      case "Likely True":
        return "text-truth-likelyTrue";
      case "Misleading":
        return "text-truth-misleading";
      case "Fake":
        return "text-truth-fake";
      default:
        return "text-gray-400";
    }
  };

  const getScoreDescription = () => {
    if (score >= 80) {
      return "This content is verified by multiple reliable sources";
    } else if (score >= 60) {
      return "This content is generally supported by sources with some caveats";
    } else if (score >= 30) {
      return "This content contains misleading or partially incorrect information";
    } else {
      return "This content appears to be false or highly misleading";
    }
  };

  const getScoreIcon = () => {
    if (score >= 80) {
      return <ShieldCheck className="h-5 w-5 mr-2" />;
    } else if (score >= 30) {
      return <Shield className="h-5 w-5 mr-2" />;
    } else {
      return <ShieldX className="h-5 w-5 mr-2" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          {getScoreIcon()}
          Truth Score
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn("px-3 py-1 rounded-full text-white text-sm font-medium shadow-sm cursor-help", getBadgeColor())}>
                {truthLevel}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-64">{getScoreDescription()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="relative pt-1">
        <div className="gradient-truth-score h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 relative">
          <div
            className="absolute h-6 w-6 top-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2"
            style={{ 
              left: markerPosition,
              backgroundColor: truthLevel === "True" ? "#4ade80" : 
                              truthLevel === "Likely True" ? "#22d3ee" : 
                              truthLevel === "Misleading" ? "#fbbf24" : "#f87171"
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-5">
          <span className="text-red-500 font-medium">Fake</span>
          <span className={cn("font-medium", getTextColor())}>Score: {score}/100</span>
          <span className="text-green-500 font-medium">True</span>
        </div>
      </div>
    </div>
  );
}
