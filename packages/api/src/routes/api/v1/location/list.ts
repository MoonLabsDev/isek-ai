import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';
import { withLogging } from '../../../../utils/routeLogger';

const handleGetLocationList = async (req: Request, res: Response) => {
  try {
    const { worldId } = req.params;

    // Check if world exists
    const world = await global.db.getWorld(worldId);
    if (!world) {
      return res.status(404).json({ error: 'World not found' });
    }

    // Get all locations for the specified world
    const locations = await global.db.getWorldLocations(worldId);

    res.json({
      success: true,
      locations: locations || [],
    });
  } catch (error) {
    console.error('Error getting location list:', error);
    res.status(500).json({ error: 'Failed to get location list' });
  }
};

export const get_location_list = (app: Express) => {
  app.get(
    '/api/v1/location/list/:worldId',
    withLogging('GET', '/api/v1/location/list/:worldId', handleGetLocationList)
  );
};
