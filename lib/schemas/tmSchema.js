import { z } from 'zod';

export const tmSchema = z.array(z.object({
  name: z.string(),
  type: z.string(),
  location: z.string().optional(),
  badge: z.number().optional(),
  displayName: z.string().optional()
}));