import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';

export const generate_location_image = (app: Express) => {
  app.post(
    '/api/v1/location/:id/generate-image',
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { prompt } = req.body;

        // Check if location exists
        const location = await global.db.getLocation(id);
        if (!location) {
          return res.status(404).json({ error: 'Location not found' });
        }

        // Generate image using an AI service
        const imageUrl = await global.ai.generateImage(
          `Generate an image for a Dungeon & Dragons location with the following description: ${location.description}. The image should be a high quality image of the location. No Text and only landscapes, buildings, or environments`
        );

        // Save the image URL to the database
        await global.db.setLocationImage(id, imageUrl);

        res.json({
          success: true,
          imageUrl,
          message: 'Location image generated and saved successfully',
        });
      } catch (error) {
        console.error('Error generating location image:', error);
        res.status(500).json({ error: 'Failed to generate location image' });
      }
    }
  );
};
