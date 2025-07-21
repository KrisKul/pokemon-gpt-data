import { readJson } from '@/lib/readJson';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { trainer, userTeam } = req.body;
  if (!trainer) {
    return res.status(400).json({ error: 'Missing trainer name' });
  }

  const team = userTeam || getTeamFromCookie(req);
  if (!team || team.length === 0) {
    return res.status(400).json({ error: 'No user team provided or found in cookies' });
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

    const scoredTeam = team.map(p => {
      const user = speciesData[p.species.toUpperCase()];
      const scoreData = scoreAgainstTrainer(user, p.level, enemy.team, speciesData, movesData);
      return {
        species: p.species,
        level: p.level,
        score: scoreData.total,
        reason: scoreData.reason,
        stats: {
          baseHP: user.baseHP,
          baseAttack: user.baseAttack,
          baseDefense: user.baseDefense,
          baseSpAttack: user.baseSpAttack,
          baseSpDefense: user.baseSpDefense,
          baseSpeed: user.baseSpeed
        },
        legalMoves: scoreData.legalMoves
      };
    });

    const recommendedTeam = scoredTeam.filter(p => p.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);

    const notRecommended = scoredTeam.filter(p => p.score <= 0).map(p => ({
      species: p.species,
      reason: p.reason || 'Low damage or poor typing'
    }));

    return res.status(200).json({
      trainer: enemy.trainer,
      recommendedTeam,
      notRecommended
    });
  } catch (err) {
    console.error('Recommendation error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

function getTeamFromCookie(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  try {
    return cookies.team ? JSON.parse(cookies.team) : [];
  } catch {
    return [];
  }
}

function scoreAgainstTrainer(poke, level, enemyTeam, speciesData, movesData) {
  let legal = new Set();
  if (poke.levelUpLearnsets) {
    poke.levelUpLearnsets.forEach(([move, lvl]) => {
      if (lvl <= level) legal.add(move);
    });
  }
  if (poke.TMHMLearnsets) {
    poke.TMHMLearnsets.forEach(move => legal.add(move));
  }
  if (poke.tutorLearnsets) {
    poke.tutorLearnsets.forEach(move => legal.add(move));
  }

  const moves = Array.from(legal).map(m => movesData.find(entry => entry.name === m)).filter(Boolean);
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