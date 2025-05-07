
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TruthScore } from "./TruthScore";
import { SourcesList } from "./SourcesList";
import { analyzeContent, detectContentType, saveToHistory } from "@/utils/ai";
import { CheckedContent } from "@/types";
import { FileSearch, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ContentChecker() {
  const [content, setContent] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<CheckedContent | null>(null);
  
  const handleCheck = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content to check");
      return;
    }
    
    setIsChecking(true);
    try {
      const contentType = detectContentType(content);
      const checkedContent = await analyzeContent(content, contentType);
      setResults(checkedContent);
      saveToHistory(checkedContent);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error checking content:", error);
      toast.error("Failed to analyze content. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Fact Checker</CardTitle>
          <CardDescription>
            Paste any news article, social media post, or YouTube link to verify its accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste article text, URL, or YouTube link here..."
            className="min-h-[150px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCheck} 
            disabled={isChecking || !content.trim()}
            className="w-full"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileSearch className="mr-2 h-4 w-4" />
                Check Facts
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {results && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <TruthScore score={results.truthScore} truthLevel={results.truthLevel} />
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Summary</h3>
                <p className="text-muted-foreground">{results.summary}</p>
              </div>
              
              <SourcesList sources={results.sources} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
