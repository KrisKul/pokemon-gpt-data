import { readJson } from '@/lib/readJson';

function displayify(move) {
  return move
    .replace(/^MOVE_/, '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export default async function handler(req, res) {
  try {
    const data = await readJson('tm-locations.json');
    const queryName = req.query.name?.toLowerCase();
    const badgeInt = parseInt(req.query.badge);

    let filtered = data;
    if (!isNaN(badgeInt)) {
      filtered = filtered.filter(tm => tm.badge <= badgeInt);
    }

    if (queryName) {
      const result = filtered.find(tm => tm.name.toLowerCase() === queryName);
      return result
        ? res.status(200).json({ ...result, displayName: displayify(result.name) })
        : res.status(404).json({ error: 'TM not found' });
    }

    const output = filtered.map(tm => ({ ...tm, displayName: displayify(tm.name) }));
    return res.status(200).json(output);
  } catch (error) {
    console.error('Failed to load tm-locations.json:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}