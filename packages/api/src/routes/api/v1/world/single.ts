import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';
import { withLogging } from '../../../../utils/routeLogger';

const handleGetWorld = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Get world from database
  const world = await global.db.getWorld(id);

  if (!world) {
    return res.status(404).json({
      success: false,
      error: 'World not found',
    });
  }

  res.json({
    success: true,
    world,
  });
};

export const get_world = (app: Express) => {
  app.get(
    '/api/v1/world/single/:id',
    withLogging('GET', '/api/v1/world/single/:id', handleGetWorld)
  );
};
