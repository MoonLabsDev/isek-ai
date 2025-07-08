import chalk from 'chalk';
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

  console.log(chalk.blue(`- World:`));
  console.log(chalk.blue(`- Name: ${chalk.yellow(genWorld.name)}`));
  console.log(chalk.blue(`- Level:${chalk.yellow(genWorld.level)}`));
  console.log(
    chalk.blue(`- Description:\n${chalk.yellow(genWorld.description)}\n\n`)
  );
  console.log(chalk.blue(`- Story:\n${chalk.yellow(genWorld.story)}\n\n`));
  console.log(
    chalk.blue(`- Locations:\n${chalk.yellow(genWorld.locations)}\n\n`)
  );
  console.log(chalk.blue(`- NPCs:\n${chalk.yellow(genWorld.npcs)}`));

  res.status(201).json({
    success: true,
    world: genWorld,
  });
};

export const create_world = (app: Express) => {
  app.post(
    '/api/v1/world/create',
    withLogging('POST', '/api/v1/world/create', handleCreateWorld)
  );
};
