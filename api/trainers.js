import { readJson } from '@/lib/readJson';

export default async function handler(req, res) {
  try {
    const data = await readJson('Trainer-battles.json');
    const query = req.query.name?.toLowerCase();

    if (query) {
      const result = data.find(trainer => trainer.name.toLowerCase() === query);
      if (!result) {
        return res.status(404).json({ error: 'Trainer not found' });
      }
      return res.status(200).json(result);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Failed to load Trainer-battles.json:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
