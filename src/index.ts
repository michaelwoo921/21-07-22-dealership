import { loadInventory, inventory } from './inventory/inventory';
import logger from './log';
import dotenv from 'dotenv';

dotenv.config()

if (process.env.ENVIRONMENT === 'prod'){
  logger.level === 'WARN';
} else {
  logger.level === 'ALL';

}


loadInventory()

setTimeout(() => {
  logger.debug(inventory)
}, 1000)

logger.debug(process.env.ENVIRONMENT);
logger.debug("begining program in dev environment");