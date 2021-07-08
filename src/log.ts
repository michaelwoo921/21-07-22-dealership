import log4js from 'log4js';
log4js.configure('logconfig.json');

const logger = log4js.getLogger();
logger.level = "debug";
export default logger;