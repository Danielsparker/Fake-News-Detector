// trustScore.js
const trustedSources = [
    "bbc.co.uk", "cnn.com", "reuters.com", "nytimes.com", "ndtv.com", "aljazeera.com"
  ];
  
  export function calculateTrustScore(article) {
    let score = 5;
  
    const url = new URL(article.url);
    const hostname = url.hostname.replace("www.", "");
  
    if (trustedSources.includes(hostname)) score += 3;
    if ((article.content || "").length > 200) score += 2;
    if (/shocking|unbelievable|you won't believe/i.test(article.title)) score -= 2;
    if (!trustedSources.includes(hostname)) score -= 3;
  
    return Math.max(0, Math.min(score, 10)); // Clamp 0-10
  }
  