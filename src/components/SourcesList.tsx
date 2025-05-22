
import { Source } from "@/types";
import { CheckCheck, ExternalLink, X, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface SourcesListProps {
  sources: Source[];
}

export function SourcesList({ sources }: SourcesListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <ShieldCheck className="w-5 h-5 mr-2 text-primary" /> 
        Verified Sources
      </h3>
      
      {sources && sources.length > 0 ? (
        <div className="space-y-3">
          {sources.map((source, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-4 transition-all hover:shadow-md bg-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-base">{source.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {source.publisher} {source.publishedDate && `• ${source.publishedDate}`}
                    {source.aiGenerated && " • AI-suggested"}
                  </p>
                </div>
                
                {source.isSupporting !== undefined ? (
                  source.isSupporting ? (
                    <div className="flex items-center text-green-500 bg-green-50 dark:bg-green-950/30 py-1 px-2 rounded-full text-xs font-medium">
                      <CheckCheck className="h-3 w-3 mr-1" />
                      <span>Supporting</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500 bg-red-50 dark:bg-red-950/30 py-1 px-2 rounded-full text-xs font-medium">
                      <X className="h-3 w-3 mr-1" />
                      <span>Contradicting</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-950/30 py-1 px-2 rounded-full text-xs font-medium">
                    <Shield className="h-3 w-3 mr-1" />
                    <span>Neutral</span>
                  </div>
                )}
              </div>
              
              {source.description && (
                <p className="text-sm mt-2 text-muted-foreground">
                  {source.description.length > 150 
                    ? `${source.description.substring(0, 150)}...` 
                    : source.description}
                </p>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-xs"
                asChild
              >
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  View Source <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border rounded-lg">
          <ShieldX className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No verified sources found for this content.</p>
          <p className="text-sm text-muted-foreground mt-1">Try checking different content or refining your search.</p>
        </div>
      )}
    </div>
  );
}
