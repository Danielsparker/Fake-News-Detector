
import { OpenAI } from "openai";
import { fetchNewsArticles, extractKeyTerms } from "./fetchNews";
import { Source } from "@/types";

// Initialize OpenAI client with the dangerouslyAllowBrowser flag
const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Add this flag to allow browser usage
});

export interface AnalysisResult {
  score: number;
  summary: string;
  sources: Source[];
}

export async function analyzeContent(inputText: string): Promise<AnalysisResult> {
  try {
    console.log("Analyzing content:", inputText);
    
    // Use both APIs to get more comprehensive results
    const searchQuery = extractKeyTerms(inputText);
    console.log("Search query:", searchQuery);
    
    // 1. Fetch news from News API
    const newsApiArticles = await fetchNewsArticles(searchQuery);
    console.log("News API articles:", newsApiArticles.length);
    
    // 2. Fetch news from NewsData API as backup
    const newsDataRes = await fetch(
      `https://newsdata.io/api/1/news?apikey=${
        import.meta.env.VITE_NEWSDATA_API_KEY
      }&q=${encodeURIComponent(searchQuery)}&language=en&size=5`
    );
    
    const newsDataJson = await newsDataRes.json();
    const newsDataArticles = newsDataJson.results || [];
    console.log("NewsData articles:", newsDataArticles.length);
    
    // Combine sources from both APIs
    let combinedSources: Source[] = [];
    
    // Add News API sources
    if (newsApiArticles && newsApiArticles.length > 0) {
      const newsApiMapped: Source[] = newsApiArticles.map(item => ({
        title: item.title || "Untitled Article",
        description: item.description || "No description available",
        url: item.url || "#",
        publisher: item.source?.name || "News Source",
        publishedDate: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : new Date().toLocaleDateString(),
        content: item.content || item.description || ""
      }));
      combinedSources = [...newsApiMapped];
    }
    
    // Add NewsData API sources if needed
    if ((combinedSources.length < 3) && newsDataArticles && newsDataArticles.length > 0) {
      const newsDataMapped: Source[] = newsDataArticles.map(item => ({
        title: item.title || "Untitled Article",
        description: item.description || "No description available",
        url: item.link || "#",
        publisher: item.source_id || "News Source",
        publishedDate: item.pubDate || new Date().toLocaleDateString(),
        content: item.content || item.description || ""
      }));
      
      combinedSources = [...combinedSources, ...newsDataMapped];
    }
    
    // Ensure we have at least some placeholder sources if both APIs failed
    if (combinedSources.length === 0) {
      console.log("No sources found, adding fallback source");
      combinedSources = [{
        title: "No relevant sources found",
        description: "Unable to find specific sources for this claim. It may be very recent or niche.",
        url: "https://www.google.com/search?q=" + encodeURIComponent(inputText),
        publisher: "Search Engine",
        publishedDate: new Date().toLocaleDateString(),
        isSupporting: undefined
      }];
    }
    
    // Take top 5 most relevant sources
    const top5Sources = combinedSources.slice(0, 5);
    console.log("Top 5 sources:", top5Sources.length);
    
    if (!top5Sources || top5Sources.length === 0) {
      return {
        score: 50,
        summary: "Unable to find relevant news articles to verify this claim. This may be due to the claim being very recent, very old, or niche in nature.",
        sources: []
      };
    }
    
    // Create a prompt for GPT to analyze the input
    const prompt = `
Analyze the truthfulness of this claim: "${inputText}"

Compare it with these news articles:
${top5Sources.map((n, i) => `${i + 1}. ${n.title} — ${n.description || 'No description available'}`).join("\n")}

Your task:
1. Rate the claim on a scale from 0-100, where 100 means completely true and 0 means completely false.
2. Provide a brief analysis of whether the sources support, contradict, or are neutral towards the claim.
3. For each source, explicitly mark whether it supports (TRUE) or contradicts (FALSE) the claim.
4. If there aren't enough relevant sources to make a determination, acknowledge that.

Format your response as:
SCORE: [number]
ANALYSIS: [your analysis]
SOURCE RATINGS:
1. [TRUE/FALSE] - Brief explanation
2. [TRUE/FALSE] - Brief explanation
etc.
`;

    console.log("Sending to OpenAI:", prompt.substring(0, 100) + "...");
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Lower temperature for more factual responses
    });

    // Extract content from response
    const content = completion.choices[0].message.content || "";
    console.log("OpenAI response:", content.substring(0, 100) + "...");
    
    // Extract score from response 
    const scoreMatch = content.match(/SCORE:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
    
    // Extract source ratings 
    const sourceRatings = content.match(/SOURCE RATINGS:([\s\S]*)/i)?.[1] || "";
    
    // Process sources with their support ratings
    const processedSources = top5Sources.map((source, i) => {
      // Look for patterns like "1. [TRUE]" or "1. [FALSE]"
      const ratingPattern = new RegExp(`${i+1}\\. \\[?(TRUE|FALSE)\\]?`, "i");
      const ratingMatch = sourceRatings.match(ratingPattern);
      
      return {
        ...source,
        isSupporting: ratingMatch ? ratingMatch[1].toUpperCase() === "TRUE" : undefined
      };
    });

    // Ensure all sources have isSupporting property set
    const finalSources = processedSources.map(source => ({
      ...source,
      isSupporting: source.isSupporting !== undefined ? source.isSupporting : true // Default to supporting if not specified
    }));

    console.log("Final sources:", finalSources.length);
    
    return {
      score: score,
      summary: content.replace(/SCORE:.*\n?/i, '')
                    .replace(/SOURCE RATINGS:[\s\S]*/i, '')
                    .trim(),
      sources: finalSources
    };
    
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
