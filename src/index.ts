import logger from './log';
import dotenv from 'dotenv';
import { start } from './input';

dotenv.config();

if (process.env.ENVIRONMENT === 'prod') {
  logger.level = 'WARN';
} else {
  logger.level = 'ALL';
}

logger.debug(process.env.ENVIRONMENT);
logger.trace('Beginning program in dev environment');

start();
