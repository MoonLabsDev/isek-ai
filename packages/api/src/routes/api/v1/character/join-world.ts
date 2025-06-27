import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';
import { withLogging } from '../../../../utils/routeLogger';

const handleJoinWorld = async (req: Request, res: Response) => {
  const { characterId, worldId } = req.body;

  // Validate required fields
  if (!characterId || !worldId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: characterId and worldId are required',
    });
  }

  try {
    // Check if character exists
    const character = await global.db.getCharacter(characterId);
    if (!character) {
      return res.status(404).json({
        success: false,
        error: 'Character not found',
      });
    }

    // Check if world exists
    const world = await global.db.getWorld(worldId);
    if (!world) {
      return res.status(404).json({
        success: false,
        error: 'World not found',
      });
    }

    // Update character's worldId
    await global.db.updateCharacterWorld(characterId, worldId);

    res.json({
      success: true,
      message: 'Character joined world successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to join world',
    });
  }
};

export const join_world = (app: Express) => {
  app.post(
    '/api/v1/character/join-world',
    withLogging('POST', '/api/v1/character/join-world', handleJoinWorld)
  );
};
