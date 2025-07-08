import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';

export const generate_npc_image = (app: Express) => {
  app.post(
    '/api/v1/npc/:id/generate-image',
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { prompt } = req.body;

        // Check if NPC exists
        const npc = await global.db.getNPC(id);
        if (!npc) {
          return res.status(404).json({ error: 'NPC not found' });
        }

        // Generate image using an AI service
        const imageUrl = await global.ai.generateImage(
          `Generate an image for a Dungeon & Dragons NPC character with the following description: ${npc.description}. The image should be a high quality portrait of the character. No Text and only character portraits`
        );

        // Save the image URL to the database
        await global.db.setNPCImage(id, imageUrl);

        res.json({
          success: true,
          imageUrl,
          message: 'NPC image generated and saved successfully',
        });
      } catch (error) {
        console.error('Error generating NPC image:', error);
        res.status(500).json({ error: 'Failed to generate NPC image' });
      }
    }
  );
};
