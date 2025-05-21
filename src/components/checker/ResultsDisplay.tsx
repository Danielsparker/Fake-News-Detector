
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TruthScore } from "../TruthScore";
import { SourcesList } from "../SourcesList";
import { CheckedContent } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface ResultsDisplayProps {
  results: CheckedContent;
  error?: string | null;
}

export function ResultsDisplay({ results, error }: ResultsDisplayProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-2 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TruthScore score={results.truthScore} truthLevel={results.truthLevel} />
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Summary</h3>
            <p className="text-muted-foreground bg-secondary/50 p-4 rounded-lg">{results.summary}</p>
          </div>
          
          <SourcesList sources={results.sources} />
        </CardContent>
      </Card>
    </div>
  );
}
