import readline from 'readline';
import logger from './log';
import {displayContents} from './inventory/inventory';
import { login, register, User } from './user/user';


let loggedUser: User|null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


export function start(){
  
rl.question(mainQ, mainFunc);

}
const mainQ = `
Choose your Options:
1. Register
2. Login
3. View cars on lot
q. Quit Program

`
function mainFunc(ans){
  // sanitize input
  switch(ans){
    case '1': 
      logger.info('Registration');
      attemptRegister();
      break;
    case '2':
      logger.info('Login')
      attemptLogin();
      break;
    case '3':
      logger.info('display Contents');
      displayContents('dealer', start);
      break;
    case 'q':
      exit(); break;
    default: 
      start();


  }

}

function attemptRegister(){
  let username: string;
  let password: string;
  let money: number;
  let role: string = 'Customer';
  rl.question('username: ', ans1 => {
    username = ans1;
    rl.question('password: ',  ans2 => {
      password = ans2;
      rl.question('the amount for deposit: ', ans3=> {
        // sanitize money

        money = Number(ans3);
        rl.question('role? ', ans4 => {
          if (ans4 ==='Employee'){
            role === 'Employee'
          }

          register(username, password, money, role, start);

        })

       
      })
    })

  })
  
}
function attemptLogin(){
  rl.question('name: ', name => {
    rl.question('password: ', password => {
      login(name, password).then(user => {
        
        loggedUser = user;
        logger.debug('loggedUser: ', loggedUser);
        
      }).catch(err =>{
        logger.error('login failed ', err);
      })

      start();
    })
  })
}


function exit(){
  process.exit(0);
}