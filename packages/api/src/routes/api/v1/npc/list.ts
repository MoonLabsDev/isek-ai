import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';
import { withLogging } from '../../../../utils/routeLogger';

const handleGetNPCList = async (req: Request, res: Response) => {
  try {
    const { worldId } = req.params;

    // Check if world exists
    const world = await global.db.getWorld(worldId);
    if (!world) {
      return res.status(404).json({ error: 'World not found' });
    }

    // Get all NPCs for the specified world
    const npcs = await global.db.getWorldNPCs(worldId);

    res.json({
      success: true,
      npcs: npcs || [],
    });
  } catch (error) {
    console.error('Error getting NPC list:', error);
    res.status(500).json({ error: 'Failed to get NPC list' });
  }
};

export const get_npc_list = (app: Express) => {
  app.get(
    '/api/v1/npc/list/:worldId',
    withLogging('GET', '/api/v1/npc/list/:worldId', handleGetNPCList)
  );
};
