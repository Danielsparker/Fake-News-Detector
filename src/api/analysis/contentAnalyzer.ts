
import { Source } from "@/types";
import { openai } from "../openai/client";

export interface AnalysisResult {
  score: number;
  summary: string;
  sources: Source[];
}

export async function analyzeWithAI(inputText: string, sources: Source[]): Promise<AnalysisResult> {
  // Create a prompt for GPT to analyze the input
  const prompt = `
Analyze the truthfulness of this claim: "${inputText}"

Compare it with these news articles:
${sources.map((n, i) => `${i + 1}. ${n.title} — ${n.description || 'No description available'}`).join("\n")}

Your task:
1. Rate the claim on a scale from 0-100, where 100 means completely true and 0 means completely false.
2. Provide a brief analysis of whether the sources support, contradict, or are neutral towards the claim.
3. For each source, explicitly mark whether it supports (TRUE) or contradicts (FALSE) the claim.
4. If there aren't enough relevant sources to make a determination, acknowledge that but still provide your best analysis.

Format your response as:
SCORE: [number]
ANALYSIS: [your analysis]
SOURCE RATINGS:
1. [TRUE/FALSE] - Brief explanation
2. [TRUE/FALSE] - Brief explanation
etc.
`;

  console.log("Sending to OpenAI:", prompt.substring(0, 100) + "...");
  
  // Call OpenAI API
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3, // Lower temperature for more factual responses
  });

  // Extract content from response
  const content = completion.choices[0].message.content || "";
  console.log("OpenAI response:", content.substring(0, 100) + "...");
  
  // Extract score from response 
  const scoreMatch = content.match(/SCORE:\s*(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
  
  // Extract source ratings 
  const sourceRatings = content.match(/SOURCE RATINGS:([\s\S]*)/i)?.[1] || "";
  
  // Process sources with their support ratings
  const processedSources = sources.map((source, i) => {
    // Look for patterns like "1. [TRUE]" or "1. [FALSE]"
    const ratingPattern = new RegExp(`${i+1}\\. \\[?(TRUE|FALSE)\\]?`, "i");
    const ratingMatch = sourceRatings.match(ratingPattern);
    
    return {
      ...source,
      isSupporting: ratingMatch ? ratingMatch[1].toUpperCase() === "TRUE" : undefined
    };
  });

  console.log("Final sources:", processedSources.length);
  
  return {
    score: score,
    summary: content.replace(/SCORE:.*\n?/i, '')
              .replace(/SOURCE RATINGS:[\s\S]*/i, '')
              .trim(),
    sources: processedSources
  };
}
