import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';
import { withLogging } from '../../../../utils/routeLogger';

const handleGetCharacterList = async (req: Request, res: Response) => {
  // Get all characters from database
  const characters = await global.db.getAllCharacters();

  res.json({
    success: true,
    characters: characters || [],
  });
};

export const get_character_list = (app: Express) => {
  app.get(
    '/api/v1/character/list',
    withLogging('GET', '/api/v1/character/list', handleGetCharacterList)
  );
};
