
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
    
  } catch (error: any) { // Added 'any' to inspect error properties
    console.error("Error analyzing content:", error);

    let summaryMessage = "An error occurred while analyzing the content. Please try again.";
    let errorSources: Source[] = [{
      title: "Error Retrieving Analysis",
      description: "There was an error analyzing the content. Please try again or try with different content.",
      url: "#",
      publisher: "System",
      publishedDate: new Date().toLocaleDateString(),
      isSupporting: false // Explicitly false for error state
    }];

    // Check if it's an OpenAI API authentication error
    if (error && (error.status === 401 || (error.error && error.error.code === 'invalid_api_key'))) {
      summaryMessage = "OpenAI API Key is invalid or missing. Please check your VITE_OPENAI_API_KEY environment variable in the .env file and ensure it's active.";
      errorSources[0].title = "OpenAI API Key Error";
      errorSources[0].description = "Could not connect to OpenAI due to an API key issue. Please verify your key configuration.";
    } else if (error && error.message) {
      // General error message reflecting what the system caught
      summaryMessage = `Analysis failed: ${error.message}. Please check console logs for more details or try again.`;
      errorSources[0].description = `The system encountered an error: ${error.message}.`;
    }
    
    return {
      score: 0, // Default to 0 for errors to clearly indicate failure
      summary: summaryMessage,
      sources: errorSources
    };
  }
}

