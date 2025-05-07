
import { Source } from "@/types";
import { CheckCheck, ExternalLink, X } from "lucide-react";

interface SourcesListProps {
  sources: Source[];
}

export function SourcesList({ sources }: SourcesListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Verified Sources</h3>
      
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
                </p>
              </div>
              
              {source.isSupporting ? (
                <div className="flex items-center text-green-500 bg-green-50 dark:bg-green-950/30 py-1 px-2 rounded-full text-xs font-medium">
                  <CheckCheck className="h-3 w-3 mr-1" />
                  <span>Supporting</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500 bg-red-50 dark:bg-red-950/30 py-1 px-2 rounded-full text-xs font-medium">
                  <X className="h-3 w-3 mr-1" />
                  <span>Contradicting</span>
                </div>
              )}
            </div>
            
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 text-xs font-medium text-primary hover:underline"
            >
              View Source <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
