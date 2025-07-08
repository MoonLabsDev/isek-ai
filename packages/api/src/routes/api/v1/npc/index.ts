export * from './list';
import { Express } from 'express';

import { generate_npc_image } from './generate-image';
import { get_npc_list } from './list';

export const npc_routes = (app: Express) => {
  get_npc_list(app);
  generate_npc_image(app);
};
