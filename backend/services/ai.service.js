const axios = require("axios");

exports.generateDishDescription = async ({
  name,
  category,
  spiceLevel,
  price,
}) => {
  const ensureUnder150 = (str) => {
    if (!str) return "";
    let text = str.trim().replace(/\s+/g, " ");
    if (text.length <= 150) return text;
    let truncated = text.substring(0, 146);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 90) {
      truncated = truncated.substring(0, lastSpace);
    }
    return truncated + "...";
  };

  const prompt = `
You are a professional culinary assistant.
Generate a mouth-watering dish description for:

Dish Name: ${name}
Category: ${category || "General"}
Spice Level: ${spiceLevel || "Medium"}
Base Price: ${price || 0}

STRICT RULES:
1. MAX 150 CHARACTERS TOTAL. Must be appetizing and strictly under 150 characters.
2. Return ONLY valid JSON in this format:
{
  "description": "string",
  "tags": ["string"],
  "allergens": ["string"],
  "serves": "1",
  "bestFor": ["Lunch", "Dinner"]
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
      const parsed = JSON.parse(cleaned);
      if (parsed?.description) {
        parsed.description = ensureUnder150(parsed.description);
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Dish AI API call failed, using dynamic generator:", err.message);
  }

  // Dynamic Fallback Generator for Dishes (Guaranteed <= 150 chars)
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const dName = name?.trim() || "Special Dish";

  const openers = [
    `Delicious ${dName},`,
    `Freshly prepared ${dName},`,
    `Mouth-watering ${dName},`,
    `Authentic ${dName},`,
    `Savor our chef-special ${dName},`,
  ];

  const highlights = [
    `cooked with aromatic herbs & rich spices to perfection.`,
    `served hot with signature seasonings and authentic flavors.`,
    `crafted with fresh ingredients for a delightful taste experience.`,
    `prepared fresh with rich traditional spices for every food craving.`,
    `blended with natural spices for a memorable and savory bite.`,
  ];

  const generatedDesc = `${pick(openers)} ${pick(highlights)}`;

  return {
    description: ensureUnder150(generatedDesc),
    tags: [category || "Specialty", "Fresh"],
    allergens: ["None"],
    serves: "1-2",
    bestFor: ["Lunch", "Dinner"],
  };
};

exports.generateRestaurantDescription = async ({ name, address, isVeg }) => {
  const ensureUnder200 = (str) => {
    if (!str) return "";
    let text = str.trim().replace(/\s+/g, " ");
    if (text.length <= 200) return text;
    let truncated = text.substring(0, 196);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 130) {
      truncated = truncated.substring(0, lastSpace);
    }
    return truncated + "...";
  };

  const prompt = `
You are a top culinary copywriter.
Generate a unique, punchy 1-2 sentence description for the restaurant below.

Restaurant Name: ${name}
Location: ${address || "City Center"}
Type: ${isVeg ? "100% Pure Vegetarian" : "Multi-Cuisine Veg & Non-Veg"}

STRICT RULES:
1. MAX 200 CHARACTERS TOTAL. Must be snappy and strictly under 200 characters.
2. Be highly creative, fresh, and unique every time. Do not repeat standard phrases.
3. Return ONLY valid JSON in this format: {"description": "string"}
`;

  try {
    if (process.env.GROQ_API_KEY) {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.9,
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const cleaned = response.data.choices[0].message.content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed?.description) {
        return { description: ensureUnder200(parsed.description) };
      }
    }
  } catch (err) {
    console.warn("AI API call failed, using dynamic copywriting engine:", err.message);
  }

  // Dynamic High-Variety Copywriting Engine (Guaranteed <= 200 chars)
  const loc = address?.trim() ? address.trim() : "City Center";
  const rName = name?.trim() || "Our Restaurant";
  const lowerName = rName.toLowerCase();

  const isBakery = lowerName.includes("bake") || lowerName.includes("cake") || lowerName.includes("pastry");
  const isPizza = lowerName.includes("pizza") || lowerName.includes("burger");
  const isDhaba = lowerName.includes("dhaba") || lowerName.includes("thali") || lowerName.includes("rasoi");
  const isBiryani = lowerName.includes("biryani") || lowerName.includes("kebab") || lowerName.includes("grill");
  const isCafe = lowerName.includes("cafe") || lowerName.includes("coffee");

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const openers = [
    `Located in ${loc}, ${rName} offers`,
    `Discover ${rName} in ${loc} for`,
    `At ${rName} in ${loc}, enjoy`,
    `Visit ${rName} at ${loc} to taste`,
    `Welcome to ${rName} (${loc}), serving`,
  ];

  const closers = [
    `A must-visit spot for food lovers!`,
    `Perfect for family and friends.`,
    `Crafted for ultimate taste!`,
    `Taste the passion in every bite.`,
    `Great food and welcoming vibe!`,
  ];

  let bodyOptions = [];

  if (isBakery) {
    bodyOptions = [
      "freshly baked pastries, custom cakes, and artisanal sweet treats.",
      "oven-hot delights, rich desserts, and handcrafted cakes baked daily.",
      "mouth-watering baked goods made with premium, fresh ingredients.",
    ];
  } else if (isPizza) {
    bodyOptions = [
      "hand-tossed pizzas, juicy burgers, and crispy sides packed with flavor.",
      "cheesy wood-fired pizzas, gourmet burgers, and quick savory bites.",
      "fresh pizzas loaded with farm-fresh toppings and signature sauces.",
    ];
  } else if (isDhaba) {
    bodyOptions = [
      "authentic rustic Indian flavors, rich thalis, and traditional slow-cooked curries.",
      "hearty dhaba-style meals, hot butter naan, and aromatic North Indian dishes.",
      "wholesome home-style thalis prepared with pure ghee and heritage spices.",
    ];
  } else if (isBiryani) {
    bodyOptions = [
      "fragrant long-grain biryanis, tender kebabs, and rich Mughlai specialties.",
      "smoky tandoori grills, aromatic dum biryani, and rich flavorful gravies.",
      "authentic heritage biryanis cooked to perfection with aromatic spices.",
    ];
  } else if (isCafe) {
    bodyOptions = [
      "artisan coffees, refreshing beverages, and gourmet bites in a cozy setting.",
      "handcrafted espresso drinks, delicious snacks, and a stylish relaxing vibe.",
      "specialty brews and fresh light eats—ideal for hangout and conversation.",
    ];
  } else if (isVeg) {
    bodyOptions = [
      "100% pure veg specialties, fresh ingredients, and a warm family ambiance.",
      "delicious plant-based dishes, rich curries, and authentic regional flavors.",
      "wholesome vegetarian meals prepared fresh with rich aromatic spices.",
    ];
  } else {
    bodyOptions = [
      "flavorful multi-cuisine dishes, rich gravies, and a vibrant dining experience.",
      "exquisite chef specials, mouth-watering grills, and memorable dining moments.",
      "diverse culinary favorites, fresh ingredients, and warm hospitality.",
    ];
  }

  const generatedText = `${pick(openers)} ${pick(bodyOptions)} ${pick(closers)}`;
  return { description: ensureUnder200(generatedText) };
};



