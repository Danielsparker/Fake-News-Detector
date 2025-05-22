
import { Source } from "@/types";
import { fetchAllSources, generateAISources, getDefaultSource, processSources } from "./sources/sourceHandler";
import { analyzeWithAI } from "./analysis/contentAnalyzer";
import type { AnalysisResult } from "./analysis/contentAnalyzer";

export type { AnalysisResult } from "./analysis/contentAnalyzer";

export async function analyzeContent(inputText: string): Promise<AnalysisResult> {
  try {
    console.log("Analyzing content:", inputText);
    
    // Step 1: Fetch sources from news APIs
    let combinedSources = await fetchAllSources(inputText);
    
    // Step 2: If no sources found, generate AI suggestions
    if (combinedSources.length === 0) {
      combinedSources = await generateAISources(inputText);
    }
    
    // Step 3: Still no sources? Add a fallback
    if (combinedSources.length === 0) {
      combinedSources = getDefaultSource(inputText);
    }
    
    // Step 4: Process and deduplicate sources
    const processedSources = processSources(combinedSources);
    
    // Step 5: Analyze content with OpenAI
    return await analyzeWithAI(inputText, processedSources);
    
  } catch (error) {
    console.error("Error analyzing content:", error);
    // Return fallback data so UI doesn't break
    return {
      score: 50,
      summary: "An error occurred while analyzing the content. Please try again.",
      sources: [{
        title: "Error retrieving sources",
        description: "There was an error analyzing the content. Please try again or try with different content.",
        url: "#",
        publisher: "System",
        publishedDate: new Date().toLocaleDateString(),
        isSupporting: false
      }]
    };
  }
}
