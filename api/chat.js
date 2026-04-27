
export default async function handler(req, res) {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
You are a premium perfume assistant for Scent Verse.

Rules:
- Talk like a human, not robotic
- Keep replies short (1–3 lines)
- Recommend perfumes confidently
- Guide user to choose
- Sound premium, not cheap

Products:
- Ombré Leather → strong, bold, masculine
- Khamrah → sweet, warm, luxury
- Imagination → fresh, daily wear
- Good Girl → feminine, bold
- Oud & Roses → rich, romantic
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

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({
      reply: "Something went wrong. Try again."
    });
  }
}
