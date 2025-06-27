import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';
import { withLogging } from '../../../../utils/routeLogger';

const handleGetWorldList = async (req: Request, res: Response) => {
  // Get all worlds from database
  const worlds = await global.db.getWorlds();

  res.json({
    success: true,
    worlds: worlds || [],
  });
};

export const get_world_list = (app: Express) => {
  app.get(
    '/api/v1/world/list',
    withLogging('GET', '/api/v1/world/list', handleGetWorldList)
  );
};
