import { useState } from 'react';
import { fetchNewsArticles } from './api/fetchNews';

export default function CheckNews() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSubmit = async () => {
    const news = await fetchNewsArticles(query);
    setResults(news);
  };

  return (
    <div className="p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a news claim..."
        className="border p-2 rounded w-full"
      />
      <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 mt-2 rounded">
        Verify News
      </button>

      {results.length > 0 && (
        <div className="mt-4">
          {results.slice(0, 5).map((article, i) => (
            <div key={i} className="border-b pb-2 mb-2">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold">{article.title}</a>
              <p className="text-sm text-gray-600">{article.source.name} | {new Date(article.publishedAt).toLocaleDateString()}</p>
              <p>{article.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
