// api/chat.js
// Vercel Serverless Function — proxies requests to OpenRouter API
// The OPENROUTER_API_KEY environment variable is set in the Vercel dashboard (never in code)

const SYSTEM_PROMPT = `You are DuanneBot, a friendly and professional portfolio assistant for Duanne Harold S. Alava.

About Duanne:
- Full name: Duanne Harold S. Alava, 20 years old
- Education: 2nd-year BS Information Technology student at Our Lady of Lourdes College Foundation Inc., Philippines
- Roles: Frontend Developer, Digital Illustrator, aspiring Python Automation Specialist
- Tagline: "Driven by Innovative Thinking and creates remarkable Projects"

Skills:
- Programming: HTML5, CSS3, JavaScript, Java, Python, C++, MySQL
- Frameworks: React, Node.js, Laravel, Tailwind CSS
- Core: UX/UI Design, System Development, Frontend & Backend Development, Communication
- Creative: Digital Illustration

Projects:
1. Employee Attendance & Payroll System – HR automation system in Java with MySQL
2. ATM Simulation – Java console app simulating banking operations (OOP)
3. Moon Shooter – Arcade space shooter game (JavaScript/Canvas)
4. LooTech – E-commerce website for gaming & professional computer devices
5. Larga.ph – AI-powered logistics and marketplace connecting Filipino farmers and truckers to reduce post-harvest losses

Contact: Available for freelance, collaborations, and internship opportunities. Based in the Philippines.

Portfolio sections: Home, About Me, Skills, Projects, Contact.

Instructions:
- Be warm, concise, and professional
- Guide users to explore the portfolio (e.g., "Scroll to the Projects section to see...")
- If asked for contact info, mention the contact section and availability
- Keep responses short (2-4 sentences max) unless detail is needed
- Speak as if you represent Duanne directly`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Read API key from environment (set in Vercel dashboard)
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages array required.' });
  }

  try {
    // Prepend system prompt as the first message (OpenAI-compatible format)
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ];

    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://duannealava.vercel.app', // update to your actual domain
        'X-Title': 'DuanneBot — Portfolio Assistant',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-guard-4-12b',
        max_tokens: 1000,
        messages: fullMessages,
      }),
    });

    if (!openRouterRes.ok) {
      const errBody = await openRouterRes.text();
      console.error('OpenRouter API error:', errBody);
      return res.status(openRouterRes.status).json({ error: 'Upstream API error', detail: errBody });
    }

    const data = await openRouterRes.json();

    // Normalize to a simple { reply } response the frontend can easily consume
    const reply = data.choices?.[0]?.message?.content
      ?? "Sorry, I couldn't process that. Try asking something else!";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}
