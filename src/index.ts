import userService from './user/user.service';
import logger from './log';
import dotenv from 'dotenv';
import { start } from './input';

dotenv.config()

if (process.env.ENVIRONMENT === 'prod'){
  logger.level === 'WARN';
} else {
  logger.level === 'ALL';

}

logger.debug(process.env.ENVIRONMENT);
logger.debug("begining program in dev environment");

start();
