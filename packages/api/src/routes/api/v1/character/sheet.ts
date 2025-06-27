import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';
import { withLogging } from '../../../../utils/routeLogger';

const handleGetCharacterSheet = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Get character from database
  const character = await global.db.getCharacter(id);

  if (!character) {
    return res.status(404).json({
      success: false,
      error: 'Character not found',
    });
  }

  const response = {
    success: true,
    character,
  };

  res.json(response);
};

export const get_character_sheet = (app: Express) => {
  app.get(
    '/api/v1/character/sheet/:id',
    withLogging('GET', '/api/v1/character/sheet/:id', handleGetCharacterSheet)
  );
};
