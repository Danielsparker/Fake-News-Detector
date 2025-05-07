import { CheckedContent, ContentType, Source, TruthLevel } from "@/types";

// Mocked AI analysis function until we integrate with real APIs
export async function analyzeContent(content: string, contentType: ContentType): Promise<CheckedContent> {
  // This function would typically call an API endpoint that uses GPT-4 and fact-checking APIs
  // For now, we'll mock the response
  
  // Generate a random ID
  const id = Math.random().toString(36).substring(2, 15);
  
  // Generate a random truth score between 0 and 100
  const truthScore = Math.floor(Math.random() * 101);
  
  // Determine truth level based on score
  let truthLevel: TruthLevel;
  if (truthScore >= 80) {
    truthLevel = "True";
  } else if (truthScore >= 60) {
    truthLevel = "Likely True";
  } else if (truthScore >= 30) {
    truthLevel = "Misleading";
  } else {
    truthLevel = "Fake";
  }
  
  // Mock sources
  const sources: Source[] = [
    {
      title: "Fact Check: Understanding the Context",
      url: "https://example.com/factcheck/1",
      publisher: "FactCheck.org",
      publishedDate: "2025-04-30",
      isSupporting: truthScore > 50
    },
    {
      title: "In-depth Analysis of the Claim",
      url: "https://example.com/analysis/2",
      publisher: "Reuters",
      publishedDate: "2025-05-01",
      isSupporting: truthScore > 40
    },
    {
      title: "Expert Opinion on the Matter",
      url: "https://example.com/expert/3",
      publisher: "Associated Press",
      publishedDate: "2025-05-02",
      isSupporting: truthScore > 30
    }
  ];
  
  // Mock summary based on truth level
  let summary = "";
  if (truthLevel === "True") {
    summary = "This content appears to be factually accurate and is supported by multiple credible sources. The information presented aligns with verified facts and expert consensus.";
  } else if (truthLevel === "Likely True") {
    summary = "This content is mostly accurate, though some details may be simplified or require additional context. The core claims are supported by evidence.";
  } else if (truthLevel === "Misleading") {
    summary = "While containing some accurate information, this content presents facts in a misleading way or omits crucial context, potentially leading readers to incorrect conclusions.";
  } else {
    summary = "This content contains significant factual errors or makes claims that are contradicted by credible sources. The information presented is not reliable.";
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id,
    content,
    contentType,
    truthScore,
    truthLevel,
    summary,
    sources,
    timestamp: new Date()
  };
}

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
