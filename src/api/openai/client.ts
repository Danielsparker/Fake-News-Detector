
import { OpenAI } from "openai";

// Helper to get API key: first try localStorage, fallback to env
function getOpenAIApiKey(): string | undefined {
  if (typeof window !== "undefined") {
    const key = window.localStorage.getItem("openai_api_key");
    if (key && key.startsWith("sk-")) return key;
  }
  // fallback to env
  return import.meta.env.VITE_OPENAI_API_KEY;
}

// Initialize OpenAI client with the dangerouslyAllowBrowser flag
export const openai = new OpenAI({ 
  apiKey: getOpenAIApiKey(),
  dangerouslyAllowBrowser: true 
});

