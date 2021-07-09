import userService from './user/user.service';
import logger from './log';
import dotenv from 'dotenv';

dotenv.config()

if (process.env.ENVIRONMENT === 'prod'){
  logger.level === 'WARN';
} else {
  logger.level === 'ALL';

}


logger.debug(process.env.ENVIRONMENT);
logger.debug("begining program in dev environment");
userService.getUserByName('Cindy').then(u => {
  console.log('u: ', u);
}).catch(err => console.log(err));

userService.addUser({name: 'Elisa', password: 'pass', money: 6000, role:'Customer'}).then().catch(() => {
  
})