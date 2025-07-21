import { readJson } from '@/lib/readJson';

export default async function handler(req, res) {
  const { pokemon, levelCap, badgeCount } = req.body;

  if (!pokemon || !levelCap || !badgeCount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const [speciesData, movesData, tmData] = await Promise.all([
      readJson('speciesData.json'),
      readJson('moves.json'),
      readJson('Tm-locations.json')
    ]);

    const result = {
      pokemon,
      levelCap,
      badgeCount,
      message: `This would build a legal set for ${pokemon} under level cap ${levelCap} and badge ${badgeCount}.`
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error('Build error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
