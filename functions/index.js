const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const fetch = require("node-fetch");

// 🔐 Get keys from environment config
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.openai_key || "";
const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.newsapi_key || "";

// 🌐 Main function: checks news credibility
exports.checkNewsCredibility = onRequest(async (req, res) => {
  try {
    const userInput = req.body.text;
    if (!userInput) {
      res.status(400).send("❌ No input provided");
      return;
    }

    // 1️⃣ Fetch latest news articles
    const newsResponse = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(userInput)}&language=en&pageSize=5&sortBy=publishedAt`, {
      headers: {
        Authorization: `Bearer ${NEWS_API_KEY}`,
      },
    });

    const newsData = await newsResponse.json();
    const articles = newsData.articles || [];

    const articleSummary = articles.map((a, i) => `${i + 1}. ${a.title} - ${a.description}`).join("\n");

    // 2️⃣ Build GPT prompt
    const prompt = `
User submitted this news:
"${userInput}"

Compare with:
${articleSummary}

Is it true or fake? Give a verdict with short reasoning.
`;

    // 3️⃣ Call OpenAI API
    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You're a news credibility checker." },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
      }),
    });

    const gptData = await gptResponse.json();
    const result = gptData.choices?.[0]?.message?.content || "No clear verdict found.";

    logger.info("✅ GPT Verdict:", result);

    res.status(200).json({ verdict: result, articles });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Internal server error");
  }
});
