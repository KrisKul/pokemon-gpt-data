import { readJson } from '@/lib/readJson';

function displayify(move) {
  return move
    .replace(/^MOVE_/, '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function handler(req, res) {
  const { species, level, badges } = req.query;

  if (!species || !level || !badges) {
    return res.status(400).json({ error: 'Missing species, level, or badges parameter' });
  }

  try {
    const [speciesData, tmData] = await Promise.all([
      readJson('speciesData.json'),
      readJson('tm-locations.json')
    ]);

    const poke = speciesData[species.toUpperCase()];
    if (!poke) {
      return res.status(404).json({ error: 'Pokémon species not found' });
    }

    const currentLevel = parseInt(level);
    const badgeLevel = parseInt(badges);
    let legalMoves = [];

    if (poke.levelUpLearnsets) {
      poke.levelUpLearnsets.forEach(([move, lvl]) => {
        if (lvl <= currentLevel) legalMoves.push(move);
      });
    }

    if (badgeLevel >= 2 && poke.TMHMLearnsets) {
      legalMoves.push(...poke.TMHMLearnsets);
    }

    if (badgeLevel >= 6 && poke.tutorLearnsets) {
      legalMoves.push(...poke.tutorLearnsets);
    }

    const uniqueMoves = [...new Set(legalMoves)].sort();

    const stats = {
      baseHP: poke.baseHP,
      baseAttack: poke.baseAttack,
      baseDefense: poke.baseDefense,
      baseSpAttack: poke.baseSpAttack,
      baseSpDefense: poke.baseSpDefense,
      baseSpeed: poke.baseSpeed,
      BST: poke.BST
    };

    return res.status(200).json({
      species: poke.name,
      level: currentLevel,
      badges: badgeLevel,
      stats,
      legalMoves: uniqueMoves.map(displayify)
    });
  } catch (err) {
    console.error('Error computing legality:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}