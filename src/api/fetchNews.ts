
// src/api/fetchNews.ts
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  content?: string;
  author?: string;
}

export async function fetchNewsArticles(query: string): Promise<NewsArticle[]> {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  
  // Add keywords to improve search
  const enhancedQuery = `${query} facts verification`;
  
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(enhancedQuery)}&language=en&pageSize=10&sortBy=relevancy&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`News API responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (data.status === 'error') {
      throw new Error(data.message || 'Error fetching news');
    }
    
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return [];
  }
}

// Function to extract key terms from a claim for better searches
export function extractKeyTerms(claim: string): string {
  // Remove question marks and common words that don't add search value
  const cleanedClaim = claim.replace(/\?/g, '')
                           .replace(/is|the|a|an|has|have|did|do|does|are|am|was|were|will|would|could|should/gi, '')
                           .trim();
  
  // Return the cleaned claim or the original if cleaning removed too much
  return cleanedClaim.length > 3 ? cleanedClaim : claim;
}
