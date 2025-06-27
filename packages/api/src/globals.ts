import { DB, IsekAI } from '@moonlabs/isek-ai-core';

export const global: {
  db: DB;
  ai: IsekAI;
} = {
  db: new DB(),
  ai: new IsekAI(),
};
