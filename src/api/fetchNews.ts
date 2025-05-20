
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
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=10&apiKey=${API_KEY}`;

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
