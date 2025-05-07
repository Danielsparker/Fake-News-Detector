
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { getHistory, clearHistory } from "@/utils/ai";
import { HistoryItem } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { CheckCheck, FileX, InfoIcon, AlertTriangle, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  useEffect(() => {
    const loadHistory = () => {
      const historyItems = getHistory();
      setHistory(historyItems);
    };
    
    loadHistory();
    
    // Update history when storage changes
    const handleStorageChange = () => {
      loadHistory();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    toast.success("History cleared");
  };
  
  const getTruthIcon = (truthLevel: string) => {
    switch (truthLevel) {
      case "True":
        return <CheckCheck className="h-4 w-4 text-truth-true" />;
      case "Likely True":
        return <InfoIcon className="h-4 w-4 text-truth-likelyTrue" />;
      case "Misleading":
        return <AlertTriangle className="h-4 w-4 text-truth-misleading" />;
      case "Fake":
        return <FileX className="h-4 w-4 text-truth-fake" />;
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Check History</h1>
            {history.length > 0 && (
              <Button variant="outline" onClick={handleClearHistory}>
                Clear History
              </Button>
            )}
          </div>
          
          {history.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No checks in your history yet.</p>
                <Button asChild className="mt-4">
                  <Link to="/">Check Something Now</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.content}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(item.timestamp), "MMM d, yyyy • h:mm a")}
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getTruthIcon(item.truthLevel)}
                        <span 
                          className={`text-sm font-medium ${
                            item.truthLevel === "True" ? "text-truth-true" : 
                            item.truthLevel === "Likely True" ? "text-truth-likelyTrue" : 
                            item.truthLevel === "Misleading" ? "text-truth-misleading" : 
                            "text-truth-fake"
                          }`}
                        >
                          {item.truthLevel}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          item.truthLevel === "True" ? "bg-truth-true" : 
                          item.truthLevel === "Likely True" ? "bg-truth-likelyTrue" : 
                          item.truthLevel === "Misleading" ? "bg-truth-misleading" : 
                          "bg-truth-fake"
                        }`} 
                        style={{ width: `${item.truthScore}%` }}
                      />
                    </div>
                    <div className="text-xs mt-1 text-right">Score: {item.truthScore}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
