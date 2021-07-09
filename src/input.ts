import readline from 'readline';
import logger from './log';
import {createItem, displayContents, getByKeys, Inventory, Payment_Info, updateItem} from './inventory/inventory';
import { getUserByName, login, register, updateUser, User } from './user/user';


let loggedUser: User|null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/*
login: -Fine
register: -Fine
display Contents: -Fine
quit:  -Fine
log out - Fine
restock/remove,
view owned car as a customer
view remaining payments
view all payments as an employee
calulate monthly payment
makeOffer
accept/reject pendingOffer
updateOwnership after purchase
system reject all other pending offer


*/

export function start(){
  if (!loggedUser){
    rl.question(mainQ, mainFunc);
  } else if (loggedUser && loggedUser.role ==='Employee'){
    rl.question(employeeQ, employeeFunc);
  } else {
    rl.question(customerQ, customerFunc);
  }

}
const mainQ = `
Choose your Options:
1. Register
2. Login
3. View cars on lot
q. Quit Program

`

const employeeQ = `
Choose your Options:
1. Display Cars on Lots
2. add Car
3. View payments
4. Accept/Reject Offer
5. restock/remove
q. Logout

`

const customerQ = `
Choose your Options:
1. Display Cars on Lots
2. Make an Offer
3. View Owned Cars/payment info 
q. Log Out

`
function employeeFunc(ans:string){
  logger.trace('employeeFunc is running');
  switch(ans){
    case '1':
      logger.info('display Contents');
      displayContents('dealer', start);
      break;
    case '2': 
      logger.trace('add a car');
      // addItem();
      break; 
    case '3':
      logger.trace('view all payments');
      paymentInfo();
      break;
    case '4':
      logger.trace('accept/reject offer');
      processOffer();
    case '5':
      logger.trace('restock/remove');
      restock();
    case 'q': 
      logout(start); break;
    default: 
      start();
  }

}
function customerFunc(ans:string){
  logger.trace('customerFunc is running');
  switch(ans){
    case '1':
      logger.info('display Contents');
      displayContents('dealer', start);
      break;
    case '2': 
      logger.trace('making an offer');
      makeOffer();
      break; 
    case '3':
      logger.trace('view owned cars and payment info');
      paymentInfo();
      break;
    case 'q': 
      logout(start); break;
    default: 
      start();
  }

}
function mainFunc(ans: string){
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

function restock(){
  logger.trace('Attempting restock/remove');


}
interface Offer {
  id: number;
  car_id: number;
  name: string;
  o_pr: number;
  d_p: number;
  mon: number;

}
let offerIdMax =0;
let offers: Offer[] = [];
function displayOffer(offer: Offer){
  if (offer.d_p >= offer.o_pr){
    return `${offer.id}. ${offer.name} offered $${offer.o_pr} for ${offer.car_id} with full cash`
  }
  else {
    return `${offer.id}. ${offer.name} offered $${offer.o_pr} for ${offer.car_id} with $${offer.d_p} downpayment 
    and $${offer.mon} months of financing for the remaining amount of $${offer.o_pr - offer.d_p}`
  }
}

function printOffers(c_id?: number){
  if(c_id){
    offers.forEach(offer => {
      if(offer.car_id === c_id){
        displayOffer(offer);
      }
    })
  }
  else {
    offers.forEach(offer => {
      displayOffer(offer);
    })
  }
}
let accepted: Offer[];

function acceptOffer(id: number): Offer | null {
// accept one offer system automatically reject all other with the same car_id
accepted = offers.filter(offer => offer.id === id);
if (accepted.length>0){
  offers = offers.filter(offer => { offer.car_id != accepted[0].car_id});
  return accepted[0];
}
return null;

}
function rejectOffer(id: number){
  // reject only one offer
  offers = offers.filter(offer => offer.car_id != id);
}


function processOffer(){
  // save selected in user, dealership db ...
  let selected : Offer | null;
  printOffers();
  rl.question(`Which offer do you select? (id) `, id => {
    // sanitize id
    selected = acceptOffer(Number(id));
    logger.debug(selected);
    logger.debug(offers);
    if (selected){
      let paymentInfo: Payment_Info;
      let price = selected.o_pr;
      let downpayment = selected.d_p;
      let loan = selected.o_pr - selected.d_p;
      let monthly_payment = loan / selected.mon;
      let payment_made = 0;
      let mon_financing= selected.mon;
      let car_id =selected.car_id
      paymentInfo={
        price, downpayment, loan, 
        monthly_payment, payment_made, mon_financing, car_id
      }

            // get user
      getUserByName(selected.name).then(user => {
        if (user && selected && user.money>= selected.d_p){
          user.money -= paymentInfo.downpayment;
          // update dealership, user info
          getByKeys('dealer', car_id, (selection: Inventory, cont: Function) => {}, start,  (selection: Inventory) => {
          if(selection.stock && selection.stock >0){
            selection.stock--;
            updateUser(user);
            updateItem(selection, () => {
              logger.debug('after updating item: ', selection);
              selection.owner = user.name;
              selection.price =price;
              selection.payment_info = paymentInfo;
              selection.stock = undefined;
              createItem(selection);
            });
            // selection.owner = user.name;
            // selection.payment_info = paymentInfo;


          }
      
        })

        }else{
          console.log('not enough money to proceed');
          start();
        }

      });


    }
    start();
  })
 
}














function makeOffer(){
  offerIdMax +=1;
  rl.question(`which car do you want car_id? `, car_id => {
    rl.question('what price? ', price => {
      rl.question('downpayment? ', d_p => {
        rl.question(`how many months of financing? `, mon => {
          // sanitize inputs
          if (loggedUser){
            let offer: Offer = {car_id: Number(car_id), name : loggedUser.name, o_pr: Number(price),
              d_p: Number(d_p), id: offerIdMax, mon: Number(mon)
            }
            offers.push(offer);
          }
          logger.debug(offers);
          start();
        })
      })
    })
  })
}

function paymentInfo(){

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
        start();
        
      }).catch(err =>{
        logger.error('login failed ', err);
        start();
      })


    })
  })
}


function exit(){
  process.exit(0);
}

function logout(callback: Function){
  loggedUser = null;
  callback();
}