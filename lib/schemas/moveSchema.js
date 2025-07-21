import { z } from 'zod';

export const moveSchema = z.array(z.object({
  name: z.string(),
  displayName: z.string(),
  type: z.string(),
  power: z.number().nullable().optional(),
  accuracy: z.number().nullable().optional(),
  priority: z.number().optional(),
  category: z.string().optional()
}));
