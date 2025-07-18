const data = require('../speciesData.json');

export default function handler(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Missing Pokémon name" });

  const match = data.find(p => p.name?.toLowerCase() === name.toLowerCase());

  if (!match) return res.status(404).json({ error: `Species not found for ${name}` });

  return res.status(200).json(match);
}
