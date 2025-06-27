import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';
import { withLogging } from '../../../../utils/routeLogger';

const handleCreateWorld = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  // Validate required fields
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name and description are required',
    });
  }

  // Create world data object
  const level = 1;
  const genWorld = await global.ai.generateWorld(
    name.trim(),
    description,
    level
  );

  // Save world to database
  const world = await global.db.createWorld(genWorld);

  res.status(201).json({
    success: true,
    world,
  });
};

export const create_world = (app: Express) => {
  app.post(
    '/api/v1/world/create',
    withLogging('POST', '/api/v1/world/create', handleCreateWorld)
  );
};
