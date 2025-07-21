import { z } from 'zod';

export const speciesSchema = z.array(z.object({
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
