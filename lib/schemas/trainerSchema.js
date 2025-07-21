import { z } from 'zod';

export const trainerSchema = z.array(z.object({
  name: z.string(),
  trainer: z.string().optional(),
  team: z.array(z.object({
    species: z.string(),
    level: z.number(),
    badgesRequired: z.number().optional()
  })).optional()
}));
