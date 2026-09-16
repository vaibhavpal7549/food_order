const axios = require("axios");

exports.generateDishDescription = async ({
  name,
  category,
  spiceLevel,
  price,
}) => {
  const prompt = `
You are a professional food classification assistant.

Generate ONLY valid JSON.
No markdown.
No explanation text.

IMPORTANT RULES:
- Tags must be accurate restaurant-style tags
- Do NOT misclassify dishes
- Do NOT label main courses as desserts
- Allergens must be realistic
- Serves must be realistic (1 or 2)
- bestFor must be meal timings only

Dish Name: ${name}
Category: ${category}
Spice Level: ${spiceLevel}
Base Price: ${price}

Return JSON in this EXACT format:
{
  "description": "string",
  "tags": ["string"],
  "allergens": ["string"],
  "serves": "string",
  "bestFor": ["string"]
}
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return JSON.parse(response.data.choices[0].message.content);
};

exports.generateRestaurantDescription = async ({ name, address, isVeg }) => {
  const prompt = `
You are a top restaurant critic and culinary copywriter.
Generate a unique, engaging 2-3 sentence description for the restaurant below.

Restaurant Name: ${name}
Location: ${address || "City Center"}
Type: ${isVeg ? "100% Pure Vegetarian" : "Multi-Cuisine Veg & Non-Veg"}

Rules:
- Be specific, creative, and evocative.
- Mention signature atmosphere, culinary style, and fresh ingredients.
- Do NOT use generic repetitive templates.

Return JSON in this EXACT format:
{
  "description": "string"
}
`;

  try {
    if (process.env.GROQ_API_KEY) {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const cleaned = response.data.choices[0].message.content.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn("AI API call failed, using intelligent dynamic generator:", err.message);
  }

  // Smart Dynamic Copywriting Engine
  const loc = address?.trim() ? address.trim() : "the heart of town";
  const rName = name?.trim() || "Our Restaurant";
  const lowerName = rName.toLowerCase();

  const isBakery = lowerName.includes("bake") || lowerName.includes("cake") || lowerName.includes("pastry");
  const isPizza = lowerName.includes("pizza") || lowerName.includes("burger");
  const isDhaba = lowerName.includes("dhaba") || lowerName.includes("thali") || lowerName.includes("rasoi");
  const isBiryani = lowerName.includes("biryani") || lowerName.includes("kebab") || lowerName.includes("grill");
  const isCafe = lowerName.includes("cafe") || lowerName.includes("coffee");

  const ambiances = [
    "warm and welcoming ambiance",
    "vibrant and modern atmosphere",
    "cozy, family-friendly setting",
    "charming and lively dining space",
    "elegant yet relaxed environment",
  ];

  const vegHighlights = [
    "wholesome 100% pure vegetarian delicacies",
    "authentic plant-based regional recipes",
    "fresh, soul-nourishing vegetarian specialties",
    "rich, aromatic veg thalis and signature curries",
  ];

  const nonVegHighlights = [
    "exquisite multi-cuisine creations and flavorful grills",
    "mouth-watering North Indian & Continental delights",
    "rich, aromatic gravies and succulent chef specials",
    "diverse culinary favorites crafted for every palate",
  ];

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const ambiance = pickRandom(ambiances);
  const foodHighlight = isVeg ? pickRandom(vegHighlights) : pickRandom(nonVegHighlights);

  let customBio = "";

  if (isBakery) {
    customBio = `Indulge in freshly baked treats, artisanal cakes, and oven-hot delights at ${rName}, located in ${loc}. Known for rich flavors, premium ingredients, and a cozy atmosphere that makes every bite special.`;
  } else if (isPizza) {
    customBio = `Craving cheesy goodness? ${rName} in ${loc} serves hand-tossed pizzas, juicy burgers, and crispy sides made with farm-fresh toppings and bold, savory sauces.`;
  } else if (isDhaba) {
    customBio = `Experience authentic rustic flavors and slow-cooked traditional recipes at ${rName}, ${loc}. Serving rich, hearty dishes cooked with pure ghee, aromatic spices, and traditional warmth.`;
  } else if (isBiryani) {
    customBio = `Step into ${rName} in ${loc} for fragrant, long-grain biryanis, tender kebabs, and rich Mughlai delicacies cooked to perfection with authentic heritage spices.`;
  } else if (isCafe) {
    customBio = `A perfect spot to relax and unwind, ${rName} in ${loc} offers handcrafted coffees, refreshing beverages, and gourmet quick bites in a stylish, cozy setting.`;
  } else {
    const templates = [
      `Located in ${loc}, ${rName} brings you a ${ambiance} paired with ${foodHighlight}. Every dish is prepared with handpicked ingredients and passion to deliver an unforgettable dining experience.`,
      `Discover culinary excellence at ${rName}, situated in ${loc}. Featuring ${foodHighlight} served in a ${ambiance}, it's the ultimate destination for food lovers and family gatherings.`,
      `At ${rName} in ${loc}, we take pride in serving ${foodHighlight} in a ${ambiance}. Come enjoy authentic taste, hospitable service, and memorable meals with your loved ones.`,
      `${rName} welcomes food enthusiasts in ${loc} with a ${ambiance} and a curated menu of ${foodHighlight}. Crafted to perfection for an exceptional taste adventure.`,
    ];
    customBio = pickRandom(templates);
  }

  return { description: customBio };
};

