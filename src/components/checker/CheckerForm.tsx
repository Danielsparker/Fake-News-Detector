
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, ShieldCheck } from "lucide-react";
import { FileUploadZone } from "./FileUploadZone";
import { FileDisplay } from "./FileDisplay";

interface CheckerFormProps {
  content: string;
  setContent: (content: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  isChecking: boolean;
  onCheck: () => Promise<void>;
}

export function CheckerForm({ 
  content, 
  setContent, 
  file, 
  setFile, 
  isChecking, 
  onCheck 
}: CheckerFormProps) {
  return (
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
          
          <FileUploadZone setContent={setContent} setFile={setFile} />
          
          {file && <FileDisplay file={file} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onCheck} 
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
  );
}
