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
You are an expert perfume sales assistant for a brand called Scent Verse.

STRICT RULES:
- Only recommend from these products:
  1. Ombré Leather → strong, bold, masculine, long-lasting
  2. Khamrah → sweet, warm, luxury, date-night
  3. Imagination → fresh, citrus, daily wear
  4. Good Girl → feminine, bold, attractive
  5. Oud & Roses → rich, romantic

- Never mention other brands
- Keep replies short (1–3 lines)
- Talk like a human, confident and helpful

PRICING:
- All perfumes cost ₹1199 (40% OFF)

DELIVERY:
- Delivery time: 3–5 days across India
- Free shipping

PAYMENT:
- Cash on Delivery (COD) available
- Also supports prepaid

BEHAVIOR:
- If confused → ask fresh / strong / sweet
- If long lasting → Ombré Leather or Khamrah
- If daily use → Imagination
- If for women → Good Girl

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
