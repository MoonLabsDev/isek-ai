import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';
import { withLogging } from '../../../../utils/routeLogger';

const handleCreateCharacter = async (req: Request, res: Response) => {
  const {
    name,
    description,
    stats,
    skills,
    race,
    class: characterClass,
    background,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !description ||
    !stats ||
    !skills ||
    !race ||
    !characterClass ||
    !background
  ) {
    return res.status(400).json({
      success: false,
      error:
        'Missing required fields: name, description, stats, skills, race, class, and background are required',
    });
  }

  // Validate stats structure
  const requiredStats = [
    'strength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma',
  ];
  for (const stat of requiredStats) {
    if (typeof stats[stat] !== 'number') {
      return res.status(400).json({
        success: false,
        error: `Invalid stats: ${stat} must be a number`,
      });
    }
  }

  // Create character data object
  const characterData = {
    name: name.trim(),
    description: description.trim(),
    worldId: 'default',
    race,
    class: characterClass,
    background,
    stats,
    skills,
  };

  // Save character to database
  const char = await global.db.createCharacter(characterData);

  // Answer
  res.status(201).json({
    success: true,
    character: char.id,
  });
};

export const create_character = (app: Express) => {
  app.post(
    '/api/v1/character/create',
    withLogging('POST', '/api/v1/character/create', handleCreateCharacter)
  );
};
