import { readJson } from '@/lib/readJson';

export default async function handler(req, res) {
  const { trainer, level, badges } = req.query;
  if (!trainer || !level || !badges) {
    return res.status(400).json({ error: 'Missing trainer, level, or badges parameter' });
  }

  try {
    const [trainerData, speciesData, movesData] = await Promise.all([
      readJson('Trainer-battles.json'),
      readJson('speciesData.json'),
      readJson('moves.json')
    ]);

    const enemy = trainerData.find(t => t.trainer.toLowerCase() === trainer.toLowerCase());
    if (!enemy) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    const lvl = parseInt(level);
    const bgs = parseInt(badges);

    const candidates = Object.values(speciesData).filter(poke => {
      return (poke.levelUpLearnsets || []).some(([_, l]) => l <= lvl);
    });

    const scored = candidates.map(poke => {
      const result = scoreAgainstTrainer(poke, enemy.team, movesData, lvl, bgs);
      return {
        species: poke.name,
        score: result.total,
        reason: result.reason,
        stats: {
          baseHP: poke.baseHP,
          baseAttack: poke.baseAttack,
          baseDefense: poke.baseDefense,
          baseSpAttack: poke.baseSpAttack,
          baseSpDefense: poke.baseSpDefense,
          baseSpeed: poke.baseSpeed
        },
        legalMoves: result.legalMoves
      };
    });

    const bestTeam = scored.sort((a, b) => b.score - a.score).slice(0, 6);
    return res.status(200).json({ trainer: enemy.trainer, predictedTeam: bestTeam });

  } catch (err) {
    console.error('Team prediction error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

function scoreAgainstTrainer(poke, enemyTeam, movesData, level, badges) {
  let legal = new Set();
  if (poke.levelUpLearnsets) {
    poke.levelUpLearnsets.forEach(([move, lvl]) => {
      if (lvl <= level) legal.add(move);
    });
  }
  if (badges >= 2 && poke.TMHMLearnsets) {
    poke.TMHMLearnsets.forEach(move => legal.add(move));
  }
  if (badges >= 6 && poke.tutorLearnsets) {
    poke.tutorLearnsets.forEach(move => legal.add(move));
  }

  const moves = Array.from(legal)
    .map(m => movesData.find(entry => entry.name === m))
    .filter(Boolean);

  let total = 0;
  let notes = [];

  enemyTeam.forEach(enemy => {
    const typeHit = moves.some(m => m.type === 'WATER' && enemy.species.toUpperCase().includes('MAGMAR'));
    const strongMoves = moves.filter(m => m.power && m.power >= 60);

    if (typeHit) {
      total += 10;
      notes.push(`Water coverage vs ${enemy.species}`);
    }
    total += strongMoves.length * 1.5;
  });

  return {
    total,
    reason: notes.join(', ') || 'No strong coverage',
    legalMoves: moves.map(m => ({ name: m.name, displayName: m.displayName, type: m.type, power: m.power }))
  };
}
