import { fetchNewsArticles } from './fetchNews';
import { calculateTrustScore } from './trustScore';
import { verifyWithOpenAI } from './openaiCheck'; // 🆕
import { useEffect, useState } from 'react';

export default function NewsResults({ query }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function loadNews() {
      const rawArticles = await fetchNewsArticles(query);

      const scored = await Promise.all(
        rawArticles.map(async (article) => {
          const manualScore = calculateTrustScore(article);
          const aiScore = await verifyWithOpenAI(article.title, article.description || '');
          
          const finalScore = Math.round((manualScore + (aiScore ?? manualScore)) / 2); // fallback if AI fails

          return {
            ...article,
            score: finalScore,
            manualScore,
            aiScore
          };
        })
      );

      setArticles(scored);
    }

    if (query) loadNews();
  }, [query]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {articles.map((a, i) => (
        <div key={i} className="p-4 border rounded-xl shadow-sm">
          <h3 className="text-lg font-bold">{a.title}</h3>
          <p className="text-sm text-gray-500">{a.source.name}</p>
          
          <div className="mt-2 space-y-1">
            <span className={`text-sm font-semibold px-2 py-1 rounded 
              ${a.score >= 7 ? 'bg-green-100 text-green-700' : 
                a.score >= 4 ? 'bg-yellow-100 text-yellow-700' : 
                'bg-red-100 text-red-700'}`}>
              Final Trust Score: {a.score}/10
            </span>

            <p className="text-xs text-gray-600">
              Manual: {a.manualScore}/10 | AI: {a.aiScore ?? '...'}
            </p>
          </div>

          <a href={a.url} target="_blank" className="text-blue-600 underline text-sm mt-2 block">
            View Source
          </a>
        </div>
      ))}
    </div>
  );
}