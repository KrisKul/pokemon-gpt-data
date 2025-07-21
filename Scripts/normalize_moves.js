import fs from 'fs';

const moveFile = 'moves.json';
const raw = JSON.parse(fs.readFileSync(moveFile, 'utf8'));

const normalizeMoveName = (move) => {
  return move.name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .replace(/^(?!MOVE_)/, 'MOVE_');
};

const updated = raw.map((move) => {
  const code = normalizeMoveName(move);
  return {
    ...move,
    name: code,
    displayName: move.name
  };
});

fs.writeFileSync(moveFile, JSON.stringify(updated, null, 2));
console.log('✅ moves.json updated with name and displayName fields');
