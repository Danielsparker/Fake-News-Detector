
// File: src/api/analyze.ts
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY });

export interface NewsSource {
  title: string;
  description: string;
  url: string;
  publisher?: string;
  publishedDate?: string;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  sources: NewsSource[];
}

export async function analyzeContent(inputText: string): Promise<AnalysisResult> {
  try {
    // Fetch news articles related to the input text
    const newsRes = await fetch(
      `https://newsdata.io/api/1/news?apikey=${
        import.meta.env.VITE_NEWSDATA_API_KEY
      }&q=${encodeURIComponent(inputText)}&language=en`
    );
    
    const newsData = await newsRes.json();
    const results = newsData.results || [];
    const top3 = results.slice(0, 3);

    // Create a prompt for GPT to analyze the input
    const prompt = `
Check the truthfulness of: "${inputText}"
Compare it with:
${top3.map((n, i) => `${i + 1}. ${n.title} — ${n.description}`).join("\n")}
Rate from 0–100 and say if sources support, contradict or are neutral.
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    // Extract score from response (placeholder implementation)
    const content = completion.choices[0].message.content || "";
    const scoreMatch = content.match(/(\d+)\/100|(\d+)\s*%|score[:\s]*(\d+)/i);
    const score = scoreMatch 
      ? parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]) 
      : 50;

    return {
      score: score,
      summary: content,
      sources: top3.map(item => ({
        title: item.title,
        description: item.description,
        url: item.link,
        publisher: item.source_id,
        publishedDate: item.pubDate
      }))
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
