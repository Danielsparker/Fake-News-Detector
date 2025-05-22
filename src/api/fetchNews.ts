
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
  
  // Add keywords to improve search - remove verification terms that might skew results
  const enhancedQuery = query;
  
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(enhancedQuery)}&language=en&pageSize=10&sortBy=relevancy&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`News API error status: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    
    if (data.status === 'error') {
      console.error('News API error:', data.message);
      return [];
    }
    
    // Log and return results
    console.log(`Retrieved ${data.articles?.length || 0} articles from News API`);
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return [];
  }
}

// Function to extract key terms from a claim for better searches
export function extractKeyTerms(claim: string): string {
  // First, extract quoted content if available as it's often the most important part
  const quotedMatches = claim.match(/"([^"]+)"/g);
  if (quotedMatches && quotedMatches.length > 0) {
    // Return the first quoted string without quotes
    return quotedMatches[0].replace(/"/g, '');
  }
  
  // Extract names using capitalized words as a heuristic
  const nameMatches = claim.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g);
  const possibleNames = nameMatches ? nameMatches.join(' ') : '';
  
  // Remove question marks and common words that don't add search value
  const cleanedClaim = claim.replace(/\?/g, '')
                           .replace(/is|the|a|an|has|have|did|do|does|are|am|was|were|will|would|could|should/gi, '')
                           .trim();
  
  // If we have names, prioritize them with the cleaned claim
  if (possibleNames.length > 0) {
    return possibleNames + ' ' + cleanedClaim;
  }
  
  // Return the cleaned claim or the original if cleaning removed too much
  return cleanedClaim.length > 5 ? cleanedClaim : claim;
}

export function getKeyEntitiesFromText(text: string): string {
  // Look for names (capitalized words)
  const nameMatches = text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [];
  
  // Look for quoted content
  const quotedMatches = text.match(/"([^"]+)"/g) || [];
  const cleanedQuotes = quotedMatches.map(q => q.replace(/"/g, ''));
  
  // Combine and limit length
  let entities = [...nameMatches, ...cleanedQuotes].join(' ');
  
  if (entities.length === 0) {
    // Fallback to extractKeyTerms if no entities found
    return extractKeyTerms(text);
  }
  
  return entities;
}
