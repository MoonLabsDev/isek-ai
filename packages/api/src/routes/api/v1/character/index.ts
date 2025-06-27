import { Express } from 'express';

import { create_character } from './create';
import { get_character_list } from './list';
import { get_character_sheet } from './sheet';

export const character_routes = (app: Express) => {
  create_character(app);
  get_character_sheet(app);
  get_character_list(app);
};
