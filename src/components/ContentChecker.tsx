
import { useState, useEffect } from "react";
import { CheckedContent } from "@/types";
import { analyzeContent, detectContentType, saveToHistory } from "@/utils/ai";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { FileUploadZone } from "./checker/FileUploadZone";
import { CheckerForm } from "./checker/CheckerForm";
import { ResultsDisplay } from "./checker/ResultsDisplay";
import { Loader2 } from "lucide-react";

export function ContentChecker() {
  const [content, setContent] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<CheckedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  useEffect(() => {
    // Listen for uploaded news content
    const handleNewsContentUploaded = () => {
      const uploadedContent = localStorage.getItem("uploadedNewsContent");
      if (uploadedContent) {
        setContent(uploadedContent);
        localStorage.removeItem("uploadedNewsContent");
        toast.info("News content loaded from file", {
          description: "Click 'Check Facts' to analyze"
        });
      }
    };
    
    window.addEventListener("newsContentUploaded", handleNewsContentUploaded);
    
    // Check if there's content in localStorage on component mount
    handleNewsContentUploaded();
    
    return () => {
      window.removeEventListener("newsContentUploaded", handleNewsContentUploaded);
    };
  }, []);
  
  const handleCheck = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content to check");
      return;
    }
    
    setIsChecking(true);
    setError(null);
    try {
      const contentType = detectContentType(content);
      const checkedContent = await analyzeContent(content, contentType);
      setResults(checkedContent);
      saveToHistory(checkedContent);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error checking content:", error);
      setError("Unable to fetch results. Please try again later.");
      toast.error("Failed to analyze content. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Fact Check Any Content
          </span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Paste any news article, social media post, or YouTube link to instantly verify its accuracy
        </p>
      </div>
      
      <CheckerForm 
        content={content} 
        setContent={setContent}
        file={file}
        setFile={setFile}
        isChecking={isChecking}
        onCheck={handleCheck}
      />
      
      {isChecking && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Analyzing content...</p>
          <p className="text-muted-foreground">This may take a moment</p>
        </div>
      )}
      
      {results && !isChecking && !error && (
        <ResultsDisplay results={results} />
      )}
    </div>
  );
}
