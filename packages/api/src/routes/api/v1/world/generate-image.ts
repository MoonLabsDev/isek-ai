import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';

export const generate_world_image = (app: Express) => {
  app.post(
    '/api/v1/world/:id/generate-image',
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { prompt } = req.body;

        // Check if world exists
        const world = await global.db.getWorld(id);
        if (!world) {
          return res.status(404).json({ error: 'World not found' });
        }

        // Generate image using an AI service
        const imageUrl = await global.ai.generateImage(
          `Generate an image for a Dungeon & Dragons world with the following description: ${world.description}. The image should be a high quality image of the world. No Text and only landscapes or city/villages`
        );

        // Save the image URL to the database
        await global.db.setWorldImage(id, imageUrl);

        res.json({
          success: true,
          imageUrl,
          message: 'World image generated and saved successfully',
        });
      } catch (error) {
        console.error('Error generating world image:', error);
        res.status(500).json({ error: 'Failed to generate world image' });
      }
    }
  );
};
