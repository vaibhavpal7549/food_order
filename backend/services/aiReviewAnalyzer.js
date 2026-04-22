const axios = require("axios");

const DEFAULT_ANALYSIS = {
  sentiment: "mixed",
  summaryBullets: [],
  topMentions: [],
};

const normalizeAnalysis = (analysis = {}) => {
  const sentiment = String(analysis.sentiment || "mixed").toLowerCase();

  return {
    sentiment: ["positive", "negative", "mixed"].includes(sentiment)
      ? sentiment
      : "mixed",
    summaryBullets: Array.isArray(analysis.summaryBullets)
      ? analysis.summaryBullets.filter(Boolean).map(String).slice(0, 5)
      : [],
    topMentions: Array.isArray(analysis.topMentions)
      ? analysis.topMentions.filter(Boolean).map(String).slice(0, 10)
      : [],
  };
};

const extractJsonFromContent = (content = "") => {
  if (!content || typeof content !== "string") {
    return null;
  }

  const cleaned = content.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return null;
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch (nestedError) {
      return null;
    }
  }
};

exports.analyzeReviewsWithAI = async (reviews = []) => {
  const reviewTexts = Array.isArray(reviews)
    ? reviews
        .map((review) => {
          if (typeof review === "string") {
            return review.trim();
          }

          return (
            review?.comment ||
            review?.Comment ||
            review?.text ||
            review?.review ||
            ""
          )
            .toString()
            .trim();
        })
        .filter(Boolean)
    : [];

  if (reviewTexts.length === 0) {
    return DEFAULT_ANALYSIS;
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("AI review analysis skipped: GROQ_API_KEY is missing");
    return DEFAULT_ANALYSIS;
  }

  const prompt = `
Analyze these restaurant reviews and return ONLY valid JSON in this exact format:
{
  "sentiment": "positive | negative | mixed",
  "summaryBullets": ["point1", "point2", "point3"],
  "topMentions": ["word1", "word2"]
}

Rules:
- No markdown
- No explanation outside JSON
- Keep summaryBullets concise
- topMentions should be short food/service related phrases

Reviews:
${reviewTexts.map((text, index) => `${index + 1}. ${text}`).join("\n")}
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content || "";
    const parsedAnalysis = extractJsonFromContent(content);

    if (!parsedAnalysis) {
      console.error("AI review analysis returned invalid JSON:", content);
      return DEFAULT_ANALYSIS;
    }

    return normalizeAnalysis(parsedAnalysis);
  } catch (error) {
    console.error(
      "AI review analysis failed:",
      error?.response?.data || error.message
    );

    return DEFAULT_ANALYSIS;
  }
};
