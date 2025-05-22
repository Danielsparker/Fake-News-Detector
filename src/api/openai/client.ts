
import { OpenAI } from "openai";

// Initialize OpenAI client with the dangerouslyAllowBrowser flag
export const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});
