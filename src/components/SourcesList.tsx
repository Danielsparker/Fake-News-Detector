
import { Source } from "@/types";
import { CheckCheck, X } from "lucide-react";

interface SourcesListProps {
  sources: Source[];
}

export function SourcesList({ sources }: SourcesListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Verified Sources</h3>
      
      <div className="space-y-2">
        {sources.map((source, index) => (
          <div key={index} className="border rounded-lg p-3 transition hover:bg-secondary/50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{source.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {source.publisher} {source.publishedDate && `• ${source.publishedDate}`}
                </p>
              </div>
              
              {source.isSupporting ? (
                <div className="flex items-center text-green-500">
                  <CheckCheck className="h-4 w-4 mr-1" />
                  <span className="text-xs">Supporting</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <X className="h-4 w-4 mr-1" />
                  <span className="text-xs">Contradicting</span>
                </div>
              )}
            </div>
            
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-1 block"
            >
              View Source
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
