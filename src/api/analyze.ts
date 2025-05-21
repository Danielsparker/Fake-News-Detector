
// File: src/api/analyze.ts
import { OpenAI } from "openai";
import { fetchNewsArticles, extractKeyTerms } from "./fetchNews";
import { Source } from "@/types";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY });

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
        title: item.title,
        description: item.description || "",
        url: item.url,
        publisher: item.source?.name || "News Source",
        publishedDate: new Date(item.publishedAt).toLocaleDateString(),
        content: item.content
      }));
      combinedSources = [...newsApiMapped];
    }
    
    // Add NewsData API sources if needed
    if ((combinedSources.length < 3) && newsDataArticles && newsDataArticles.length > 0) {
      const newsDataMapped: Source[] = newsDataArticles.map(item => ({
        title: item.title,
        description: item.description || "",
        url: item.link,
        publisher: item.source_id || "News Source",
        publishedDate: item.pubDate || new Date().toLocaleDateString(),
        content: item.content
      }));
      
      combinedSources = [...combinedSources, ...newsDataMapped];
    }
    
    // Take top 5 most relevant sources
    const top5Sources = combinedSources.slice(0, 5);
    
    if (top5Sources.length === 0) {
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
${top5Sources.map((n, i) => `${i + 1}. ${n.title} — ${n.description}`).join("\n")}

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

    return {
      score: score,
      summary: content.replace(/SCORE:.*\n?/i, '')
                    .replace(/SOURCE RATINGS:[\s\S]*/i, '')
                    .trim(),
      sources: processedSources
    };
    
  } catch (error) {
    console.error("Error analyzing content:", error);
    return {
      score: 50,
      summary: "An error occurred while analyzing the content. Please try again.",
      sources: []
    };
  }
}
