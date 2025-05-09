
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function FileUploadButton() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      setFileContent(content);
    };
    reader.readAsText(file);
    
    toast.success(`File "${file.name}" uploaded successfully`);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            className="rounded-full h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all"
            size="icon"
          >
            <FileText className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Upload News Article</SheetTitle>
            <SheetDescription>
              Drag and drop a text file or click to upload news content for fact checking
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              className="hidden"
              accept=".txt,.json,.md,.text"
            />
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
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
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">Drag files here or click to upload</h3>
                <p className="text-sm text-muted-foreground">
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
                {fileContent && (
                  <div className="mt-2">
                    <Button 
                      onClick={() => {
                        // Store the content in localStorage or context to use in ContentChecker
                        localStorage.setItem("uploadedNewsContent", fileContent);
                        toast.success("Content ready to check", {
                          description: "Navigate to the fact checker to analyze this content"
                        });
                        window.dispatchEvent(new Event("newsContentUploaded"));
                      }}
                      className="w-full"
                    >
                      Check This Content
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
