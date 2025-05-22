
import { OpenAI } from "openai";
import { fetchNewsArticles, extractKeyTerms, getKeyEntitiesFromText } from "./fetchNews";
import { Source } from "@/types";

// Initialize OpenAI client with the dangerouslyAllowBrowser flag
const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

export interface AnalysisResult {
  score: number;
  summary: string;
  sources: Source[];
}

export async function analyzeContent(inputText: string): Promise<AnalysisResult> {
  try {
    console.log("Analyzing content:", inputText);
    
    // Extract key entities or terms from the input text for better search
    const searchQuery = getKeyEntitiesFromText(inputText);
    console.log("Search query:", searchQuery);
    
    // 1. Fetch news from News API
    const newsApiArticles = await fetchNewsArticles(searchQuery);
    console.log("News API articles:", newsApiArticles.length);
    
    // 2. Fetch news from NewsData API as backup
    let newsDataArticles = [];
    try {
      const newsDataRes = await fetch(
        `https://newsdata.io/api/1/news?apikey=${
          import.meta.env.VITE_NEWSDATA_API_KEY
        }&q=${encodeURIComponent(searchQuery)}&language=en&size=5`
      );
      
      const newsDataJson = await newsDataRes.json();
      newsDataArticles = newsDataJson.results || [];
      console.log("NewsData articles:", newsDataArticles.length);
    } catch (error) {
      console.error("Error fetching from NewsData API:", error);
    }
    
    // Combine sources from both APIs
    let combinedSources: Source[] = [];
    
    // Add News API sources
    if (newsApiArticles && newsApiArticles.length > 0) {
      const newsApiMapped: Source[] = newsApiArticles.map(item => ({
        title: item.title || "Untitled Article",
        description: item.description || "No description available",
        url: item.url || "#",
        publisher: item.source?.name || "News Source",
        publishedDate: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : undefined,
        content: item.content || item.description || "",
        isSupporting: true // Default, will be updated by OpenAI
      }));
      combinedSources = [...newsApiMapped];
    }
    
    // Add NewsData API sources if needed
    if (newsDataArticles && newsDataArticles.length > 0) {
      const newsDataMapped: Source[] = newsDataArticles.map(item => ({
        title: item.title || "Untitled Article",
        description: item.description || "No description available",
        url: item.link || "#",
        publisher: item.source_id || "News Source",
        publishedDate: item.pubDate || undefined,
        content: item.content || item.description || "",
        isSupporting: true // Default, will be updated by OpenAI
      }));
      
      combinedSources = [...combinedSources, ...newsDataMapped];
    }
    
    console.log("Combined sources before filtering:", combinedSources.length);
    
    // If no sources found, use OpenAI to generate some relevant sources
    if (combinedSources.length === 0) {
      console.log("No sources found, asking OpenAI to suggest relevant sources");
      
      const sourcesCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert fact checker. The user will provide a news claim. Your task is to provide 3 potential sources that might verify this claim. Format as JSON array."
          },
          {
            role: "user",
            content: `Generate 3 likely sources for this news: "${inputText}"`
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      
      try {
        const suggestedSourcesJson = JSON.parse(sourcesCompletion.choices[0].message.content || "{}");
        const suggestedSources = suggestedSourcesJson.sources || [];
        
        if (suggestedSources.length > 0) {
          combinedSources = suggestedSources.map((source: any, index: number) => ({
            title: source.title || `Suggested Source ${index + 1}`,
            description: source.description || "This source was suggested by AI based on the content.",
            url: source.url || `https://www.google.com/search?q=${encodeURIComponent(inputText)}`,
            publisher: source.publisher || "AI-suggested Source",
            publishedDate: new Date().toLocaleDateString(),
            isSupporting: true,
            aiGenerated: true
          }));
        }
      } catch (error) {
        console.error("Error parsing AI-suggested sources:", error);
      }
    }
    
    // Still no sources? Add a fallback
    if (combinedSources.length === 0) {
      combinedSources = [{
        title: "Search for more information",
        description: "Our system couldn't find specific sources for this claim. It may be very recent or niche.",
        url: "https://www.google.com/search?q=" + encodeURIComponent(inputText),
        publisher: "Search Engine",
        publishedDate: new Date().toLocaleDateString(),
        isSupporting: undefined
      }];
    }
    
    // Deduplicate sources by URL to avoid repeats
    const uniqueSources: Source[] = [];
    const urlSet = new Set();
    
    combinedSources.forEach(source => {
      if (!urlSet.has(source.url)) {
        urlSet.add(source.url);
        uniqueSources.push(source);
      }
    });
    
    // Take top 5 most relevant sources
    const top5Sources = uniqueSources.slice(0, 5);
    console.log("Top 5 sources:", top5Sources.length);
    
    // Create a prompt for GPT to analyze the input
    const prompt = `
Analyze the truthfulness of this claim: "${inputText}"

Compare it with these news articles:
${top5Sources.map((n, i) => `${i + 1}. ${n.title} — ${n.description || 'No description available'}`).join("\n")}

Your task:
1. Rate the claim on a scale from 0-100, where 100 means completely true and 0 means completely false.
2. Provide a brief analysis of whether the sources support, contradict, or are neutral towards the claim.
3. For each source, explicitly mark whether it supports (TRUE) or contradicts (FALSE) the claim.
4. If there aren't enough relevant sources to make a determination, acknowledge that but still provide your best analysis.

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
      model: "gpt-4o-mini",
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

    console.log("Final sources:", processedSources.length);
    
    return {
      score: score,
      summary: content.replace(/SCORE:.*\n?/i, '')
                    .replace(/SOURCE RATINGS:[\s\S]*/i, '')
                    .trim(),
      sources: processedSources
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
