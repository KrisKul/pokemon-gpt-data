import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const cache = new Map();

const speciesSchema = z.array(z.object({
  name: z.string(),
  type1: z.string(),
  type2: z.string().nullable().optional(),
  baseHP: z.number(),
  baseAttack: z.number(),
  baseDefense: z.number(),
  baseSpAttack: z.number(),
  baseSpDefense: z.number(),
  baseSpeed: z.number(),
  abilities: z.array(z.string()).optional(),
  BST: z.number().optional(),
  ID: z.number().optional(),
  levelUpLearnsets: z.array(z.tuple([z.string(), z.number()])).optional(),
  TMHMLearnsets: z.array(z.string()).optional(),
  tutorLearnsets: z.array(z.string()).optional(),
  heldItem: z.string().optional(),
  nature: z.string().optional(),
  level: z.number().optional(),
  badgesRequired: z.number().optional()
}));

const moveSchema = z.array(z.object({
  name: z.string(),
  displayName: z.string(),
  type: z.string(),
  power: z.number().nullable().optional(),
  accuracy: z.number().nullable().optional(),
  priority: z.number().optional(),
  category: z.string().optional()
}));

const tmSchema = z.array(z.object({
  name: z.string(),
  type: z.string(),
  location: z.string().optional(),
  badge: z.number().optional(),
  displayName: z.string().optional()
}));

const trainerSchema = z.array(z.object({
  name: z.string(),
  trainer: z.string().optional(),
  team: z.array(z.object({
    species: z.string(),
    level: z.number(),
    badgesRequired: z.number().optional()
  })).optional()
}));

export async function readJson(filename) {
  const fullPath = path.resolve(process.cwd(), 'data', filename);
  if (cache.has(fullPath)) {
    return cache.get(fullPath);
  }
  try {
    const raw = await fs.promises.readFile(fullPath, 'utf8');
    const json = JSON.parse(raw);

    // Optional validation
    if (filename === 'speciesData.json') {
      speciesSchema.parse(json);
    } else if (filename === 'moves.json') {
      moveSchema.parse(json);
    } else if (filename === 'tm-locations.json') {
      tmSchema.parse(json);
    } else if (filename === 'Trainer-battles.json') {
      trainerSchema.parse(json);
    }

    cache.set(fullPath, json);
    return json;
  } catch (err) {
    console.error(`Error reading JSON file ${filename}:`, err);
    throw err;
  }
}
