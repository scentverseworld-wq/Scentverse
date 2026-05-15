export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "No message received"
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are Aria an expert perfume sales assistant for a brand called Scent Verse.

STRICT RULES:
- Only recommend from these products:
  1. Ombré Leather → strong, bold, masculine, long-lasting
  2. Khamrah → sweet, warm, luxury, date-night
  3. Imagination → fresh, citrus, daily wear
  4. Good Girl → feminine, bold, attractive
  5. Oud & Roses → rich, romantic
  6. 🍊 Erba Pura — Fruity, citrus, vanilla. Luxurious and vibrant.
  7. 🍒 Lost Cherry — Cherry, almond, sweet, bold.
  8. 🔥 Most Wanted — Warm, spicy, toffee, masculine.
  9. 💙 Blue Oud — Oud, woody, rich, Arabic luxury.
  10. 🌊 Oud Maracuja — Exotic, fruity + oud fusion.

- Never mention other brands
- Keep replies short (1–3 lines)
- Talk like a human, confident and helpful

PRICING:
- All perfumes cost ₹1199 (40% OFF)

DELIVERY:
- Delivery time: 3–5 days across India
- Free shipping

PAYMENT:
- Cash on Delivery (COD) is not available
- Also supports prepaid

BEHAVIOR:
BEHAVIOR:

- If confused → ask: fresh / sweet / strong / luxury

- If long lasting → suggest:
  Most Wanted 🔥 or Erba Pura 🍊 or Khamrah 🌹

- If daily use → suggest:
  Imagination 🍋 or Blue Oud 💙

- If for women → suggest:
  Good Girl ☕ or Lost Cherry 🍒

- If sweet → suggest:
  Lost Cherry 🍒 or Khamrah 🌹

- If strong / bold → suggest:
  Most Wanted 🔥 or Ombré Leather 🤎

- If luxury / premium → suggest:
  Erba Pura 🍊 or Oud Maracuja 🌊

- Always recommend 1–2 best options, not all

GOAL:
Help user choose quickly and encourage purchase.
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    // SAFE HANDLING
    if (!data || !data.choices || !data.choices[0]) {
      return res.status(500).json({
        reply: "AI is busy right now. Try again."
      });
    }

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({
      reply: "Server error. Try again."
    });
  }
}
