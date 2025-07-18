import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Missing Pokémon name" });

  try {
    const filePath = path.join(process.cwd(), 'speciesData.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    const match = data.find(p => p.name?.toLowerCase() === name.toLowerCase());
    if (!match) return res.status(404).json({ error: `Species not found for ${name}` });

    return res.status(200).json(match);
  } catch (err) {
    console.error("Error reading speciesData.json", err);
    return res.status(500).json({ error: "Failed to load species data" });
  }
}
