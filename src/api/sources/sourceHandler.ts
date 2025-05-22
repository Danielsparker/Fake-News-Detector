
import { Source } from "@/types";
import { fetchNewsArticles, getKeyEntitiesFromText } from "../fetchNews";
import { openai } from "../openai/client";

export async function fetchAllSources(inputText: string): Promise<Source[]> {
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
  return combinedSources;
}

export async function generateAISources(inputText: string): Promise<Source[]> {
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
      return suggestedSources.map((source: any, index: number) => ({
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
  
  return [];
}

export function getDefaultSource(inputText: string): Source[] {
  return [{
    title: "Search for more information",
    description: "Our system couldn't find specific sources for this claim. It may be very recent or niche.",
    url: "https://www.google.com/search?q=" + encodeURIComponent(inputText),
    publisher: "Search Engine",
    publishedDate: new Date().toLocaleDateString(),
    isSupporting: undefined
  }];
}

export function processSources(combinedSources: Source[]): Source[] {
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
  return uniqueSources.slice(0, 5);
}
