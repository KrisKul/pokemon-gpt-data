import { readJson } from '@/lib/readJson';

export default async function handler(req, res) {
  const { term, type } = req.query;
  if (!term || term.length < 2) {
    return res.status(400).json({ error: 'Query term must be at least 2 characters' });
  }

  try {
    const [speciesData, movesData, tmsData] = await Promise.all([
      readJson('speciesData.json'),
      readJson('moves.json'),
      readJson('tm-locations.json')
    ]);

    const lowerTerm = term.toLowerCase();
    let results = [];

    if (!type || type === 'pokemon') {
      results.push(...Object.values(speciesData)
        .filter(p => p.name.toLowerCase().includes(lowerTerm) ||
                     p.type1.toLowerCase().includes(lowerTerm) ||
                     p.type2?.toLowerCase().includes(lowerTerm))
        .map(p => ({
          type: 'pokemon',
          name: p.name,
          id: p.ID,
          types: [p.type1, p.type2 || null],
          baseStats: {
            hp: p.baseHP,
            atk: p.baseAttack,
            def: p.baseDefense,
            spa: p.baseSpAttack,
            spd: p.baseSpDefense,
            spe: p.baseSpeed
          },
          BST: p.BST,
          abilities: p.abilities
        })));
    }

    if (!type || type === 'move') {
      results.push(...movesData
        .filter(m => m.displayName.toLowerCase().includes(lowerTerm) || m.type.toLowerCase().includes(lowerTerm))
        .map(m => ({
          type: 'move',
          name: m.name,
          displayName: m.displayName,
          typeName: m.type,
          power: m.power || 0,
          accuracy: m.accuracy || null,
          priority: m.priority || 0,
          category: m.category || 'Status'
        })));
    }

    if (!type || type === 'tm') {
      results.push(...tmsData
        .filter(tm => tm.name.toLowerCase().includes(lowerTerm) || tm.type.toLowerCase().includes(lowerTerm))
        .map(tm => ({
          type: 'tm',
          name: tm.name,
          displayName: tm.displayName || tm.name,
          typeName: tm.type,
          badgeRequired: tm.badge || 0
        })));
    }

    return res.status(200).json({
      query: term,
      filteredType: type || 'all',
      count: results.length,
      results: results.slice(0, 30)
    });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
