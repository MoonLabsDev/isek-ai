export * from './list';
import { Express } from 'express';

import { create_world } from './create';
import { generate_world_image } from './generate-image';
import { get_world_list } from './list';
import { get_world } from './single';

export const world_routes = (app: Express) => {
  create_world(app);
  get_world(app);
  get_world_list(app);
  generate_world_image(app);
};
