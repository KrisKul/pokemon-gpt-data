import { readJson } from '@/lib/readJson';

export default async function handler(req, res) {
  try {
    const data = await readJson('speciesData.json');
    const queryName = req.query.name?.toUpperCase();

    if (queryName) {
      const result = data[queryName];
      if (!result) {
        return res.status(404).json({ error: 'Species not found' });
      }
      return res.status(200).json(result);
    }

    const speciesArray = Object.values(data);
    return res.status(200).json(speciesArray);
  } catch (error) {
    console.error('Failed to load speciesData.json:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
