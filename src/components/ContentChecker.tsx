
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TruthScore } from "./TruthScore";
import { SourcesList } from "./SourcesList";
import { analyzeContent, detectContentType, saveToHistory } from "@/utils/ai";
import { CheckedContent } from "@/types";
import { AlertCircle, FileText, Loader2, ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function ContentChecker() {
  const [content, setContent] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<CheckedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    if (file.type !== 'text/plain' && file.type !== 'application/json' && !file.type.includes('text')) {
      toast.error("Please upload a text file containing news content");
      return;
    }
    
    setFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setContent(content);
    };
    reader.readAsText(file);
    
    toast.success(`File "${file.name}" uploaded successfully`);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
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
      
      <Card className="border-2 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
            Fact Checker
          </CardTitle>
          <CardDescription>
            Find out if content is true, misleading, or fake using AI-powered fact checking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Textarea
              placeholder="Paste article text, URL, or YouTube link here..."
              className="min-h-[150px] resize-none focus:ring-2 focus:ring-blue-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              className="hidden"
              accept=".txt,.json,.md,.text"
            />
            
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                  : "border-gray-300 hover:border-blue-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Drag a news file here or click to upload</p>
                <p className="text-xs text-muted-foreground">
                  Support for .txt, .json and other text files
                </p>
              </div>
            </div>
            
            {file && (
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCheck} 
            disabled={isChecking || !content.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Check Facts
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isChecking && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Analyzing content...</p>
          <p className="text-muted-foreground">This may take a moment</p>
        </div>
      )}
      
      {error && !isChecking && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {results && !isChecking && !error && (
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
      )}
    </div>
  );
}
