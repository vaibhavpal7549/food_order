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

