
import { CheckedContent, ContentType, Source, TruthLevel } from "@/types";
import { analyzeContent as apiAnalyzeContent } from "@/api/analyze";

// Helper function to determine content type
export function detectContentType(content: string): ContentType {
  // Check if it's a YouTube link
  if (content.includes("youtube.com/") || content.includes("youtu.be/")) {
    return "youtube";
  }
  
  // Check if it's a URL
  try {
    new URL(content);
    return "url";
  } catch {
    // If not a valid URL, treat as text
    return "text";
  }
}

// Function to determine truth level based on score
export function determineTruthLevel(score: number): TruthLevel {
  if (score >= 80) {
    return "True";
  } else if (score >= 60) {
    return "Likely True";
  } else if (score >= 30) {
    return "Misleading";
  } else {
    return "Fake";
  }
}

// Real analysis function that uses our API functions
export async function analyzeContent(content: string, contentType: ContentType): Promise<CheckedContent> {
  // Generate a random ID
  const id = Math.random().toString(36).substring(2, 15);
  
  // Call the real API analysis function
  const analysisResult = await apiAnalyzeContent(content);
  
  // Determine truth level based on score
  const truthLevel = determineTruthLevel(analysisResult.score);
  
  // Convert sources to ensure they match our Source type
  const sources: Source[] = analysisResult.sources;
  
  return {
    id,
    content,
    contentType,
    truthScore: analysisResult.score,
    truthLevel,
    summary: analysisResult.summary,
    sources,
    timestamp: new Date()
  };
}

// Function to save check to history
export function saveToHistory(checkedContent: CheckedContent): void {
  try {
    // Get existing history from localStorage
    const historyString = localStorage.getItem("checkit_history") || "[]";
    const history = JSON.parse(historyString);
    
    // Add new check to history (limited to latest 50 items)
    history.unshift({
      id: checkedContent.id,
      content: checkedContent.content.substring(0, 100) + (checkedContent.content.length > 100 ? "..." : ""),
      contentType: checkedContent.contentType,
      truthScore: checkedContent.truthScore,
      truthLevel: checkedContent.truthLevel,
      timestamp: new Date()
    });
    
    // Keep only the latest 50 items
    const trimmedHistory = history.slice(0, 50);
    
    // Save back to localStorage
    localStorage.setItem("checkit_history", JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Failed to save to history:", error);
  }
}

// Function to get history
export function getHistory(): any[] {
  try {
    const historyString = localStorage.getItem("checkit_history") || "[]";
    return JSON.parse(historyString);
  } catch (error) {
    console.error("Failed to get history:", error);
    return [];
  }
}

// Function to clear history
export function clearHistory(): void {
  localStorage.setItem("checkit_history", "[]");
}
