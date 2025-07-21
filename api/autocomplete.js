import { readJson } from '@/lib/readJson';

export default async function handler(req, res) {
  const input = req.query.input?.toLowerCase().trim();

  try {
    const [speciesData, movesData, tmsData] = await Promise.all([
      readJson('speciesData.json'),
      readJson('moves.json'),
      readJson('tm-locations.json')
    ]);

    const allNames = [
      ...speciesData.map(p => p.name),
      ...movesData.map(m => m.name),
      ...tmsData.map(tm => tm.name)
    ];

    const suggestions = allNames
      .filter(name => name.toLowerCase().startsWith(input || ''))
      .slice(0, 20);

    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Autocomplete error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
