// fetchNews.js
export async function fetchNewsArticles(query) {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=10&apiKey=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.articles;
}
