// api/ask.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  // This is a placeholder - in production you'd call OpenAI's API here
  return res.status(200).json({
    reply: `You asked: "${prompt}". GPT would reply here.`
  });
}
