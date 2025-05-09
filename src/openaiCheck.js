export async function verifyWithOpenAI(title, content) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
    const prompt = `
  You are a news credibility analyst.
  
  Given the following headline and content, return a JSON with a single number key called "score" (0–10), where:
  - 0 = completely fake or clickbait
  - 10 = highly trustworthy
  
  Headline: "${title}"
  
  Content: "${content}"
  
  Respond only with: {"score": <number>}
  `;
  
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      })
    });
  
    const data = await res.json();
    const text = data.choices[0].message.content;
  
    try {
      const parsed = JSON.parse(text);
      return parsed.score;
    } catch {
      return null;
    }
  }
  