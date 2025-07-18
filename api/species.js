export default async function handler(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Missing Pokémon name" });

  const data = await fetch('https://pokemon-gpt-data.vercel.app/speciesData.json').then(r => r.json());
  const match = data.find(p => p.name?.toLowerCase() === name.toLowerCase());

  if (!match) return res.status(404).json({ error: `Species not found for ${name}` });

  return res.status(200).json(match);
}
