import logger from "../log";
import userService from "./user.service";

export class User {
  public role: string = 'Customer';
  constructor(public name:string, public password: string, public money?: number, role?: string){
    if (role) {
      this.role = role;
    }
}
}

export async function login(name: string, password: string): Promise<User|null>{
  logger.debug(name + ' ' + password);
  return await userService.getUserByName(name).then(user =>{
    if (user && user.password === password){
      return user;
    }
    else {
      return null;
    }
  })
}

export async function register(username: string, password: string, money: number, role: string, callback: Function){
  userService.addUser(new User(username, password, money,role)).then(res => {
    logger.trace(res);
    callback();
  }).catch(err => {
    logger.error(err);
    console.log('Error, this probably means username already taken ');
    callback();
  });
}

export async function getUserByName(name: string): Promise<User|null> {
  return await userService.getUserByName(name).then((user)=> {
      if (user) {
          logger.debug('user: ', user);
          return user
      } else {
          return null;
      }
  })
}

export function updateUser(user: User) {
  userService.updateUser(user).then((success) => {
    if (success){
      logger.info('user updated successfully');
    }
    else{
      logger.warn('false: user not updated');
    }

  }).catch((error) => {
      logger.warn('user not updated');
  });
}