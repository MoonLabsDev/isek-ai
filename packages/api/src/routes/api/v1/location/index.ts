export * from './list';
import { Express } from 'express';

import { generate_location_image } from './generate-image';
import { get_location_list } from './list';

export const location_routes = (app: Express) => {
  get_location_list(app);
  generate_location_image(app);
};
