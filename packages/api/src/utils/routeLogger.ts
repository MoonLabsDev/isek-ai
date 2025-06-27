import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';

type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

const options = {
  logBody: false,
  timestamp: false,
};

export const withLogging = (
  method: string,
  path: string,
  handler: RouteHandler
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const timestamp = options.timestamp ? `[${new Date().toISOString()}] ` : '';

    // Log the incoming request
    console.log(
      chalk.yellow(`${timestamp}${method} ${path} - Request received`)
    );

    // Log body if enabled
    if (options.logBody && req.body && Object.keys(req.body).length > 0) {
      console.log(chalk.cyan('Request Body:'), req.body);
    }

    try {
      // Call the actual handler
      await handler(req, res, next);

      const duration = Date.now() - startTime;

      // Log successful response
      console.log(
        chalk.green(`${timestamp}${method} ${path} - Success (${duration}ms)`)
      );
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        chalk.red(`${timestamp}${method} ${path} - Error (${duration}ms):`),
        error
      );
      throw error;
    }
  };
};
