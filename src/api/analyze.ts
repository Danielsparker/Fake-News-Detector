// File: /api/analyze.ts (Node-style handler for Vercel)
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { inputText } = await req.json();

  const newsRes = await fetch(`https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&q=${encodeURIComponent(inputText)}&language=en`);
  const { results } = await newsRes.json();
  const top3 = results.slice(0, 3);

  const prompt = `
Check the truthfulness of: "${inputText}"
Compare it with:
${top3.map((n, i) => `${i + 1}. ${n.title} — ${n.description}`).join("\n")}
Rate from 0–100 and say if sources support, contradict or are neutral.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({
    score: 73, // Parse from GPT if included
    summary: completion.choices[0].message.content,
    sources: top3,
  });
}
