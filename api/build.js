export default async function handler(req, res) {
  const { pokemon, levelCap, badgeCount } = req.body;

  if (!pokemon || !levelCap || !badgeCount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const speciesData = await fetch('https://pokemon-gpt-data.vercel.app/speciesData.json').then(r => r.json());
  const movesData = await fetch('https://pokemon-gpt-data.vercel.app/moves.json').then(r => r.json());
  const tmData = await fetch('https://pokemon-gpt-data.vercel.app/Tm-locatoins.json').then(r => r.json());

  const result = {
    pokemon,
    levelCap,
    badgeCount,
    message: `This would build a legal set for ${pokemon} under level cap ${levelCap} and badge ${badgeCount}.`
  };

  return res.status(200).json(result);
}
