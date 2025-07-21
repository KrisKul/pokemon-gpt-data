import { readJson } from '@/lib/readJson';

export default async function handler(req, res) {
  try {
    const data = await readJson('moves.json');
    const queryName = req.query.name?.toLowerCase();

    if (queryName) {
      const result = data.find(m => m.name.toLowerCase() === queryName);
      if (!result) {
        return res.status(404).json({ error: 'Move not found' });
      }
      return res.status(200).json(result);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Failed to load moves.json:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}