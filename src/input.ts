import readline from 'readline';
import logger from './log';
import {createItem, displayContents, getByKeys, Inventory, itemString, Payment_Info, updateItem, displayPayments} from './inventory/inventory';
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
restock/remove -Fine
view owned car as a customer 
view remaining payments
view all payments as an employee
calulate monthly payment
makeOffer -Fine
accept/reject pendingOffer -Fine
updateOwnership after purchase 
system reject all other pending offer -Fine


*/

export function start(){
    rl.question(mainQ, mainFunc);
}

const mainQ = `
Choose your Options:
0. Debug Info
1. Register
2. Login
3. View cars on lot
6. Accept/Reject Offer
7. restock/remove
8. Make an Offer
9. View Owned Cars/payment info
10. Logout
q. Quit Program

`


function mainFunc(ans: string){
  // sanitize input
  switch(ans){
    case '0': 
      logger.info('temporay debug info')
      debugInfo();
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
    case '6':
      logger.trace('accept/reject offer');
      checkEmployee(processOffer);
      break;
    case '7':
      logger.info('restock/remove');
      checkEmployee(restock);
      break;
    case '8': 
      logger.trace('making an offer');
      checkCustomer(makeOffer);
      break; 
    case '9':
      logger.trace('view owned cars and payment info');
      checkUser(paymentInfo);
      break;
    case '10': 
      logout(start); break;
    case 'q':
      exit(); break;
    default: 
      start();

  }

}

function debugInfo(){
  if(!loggedUser){
    logger.trace('not logged in');
    start();
  }
  logger.trace(loggedUser);
  if(!offers){
    logger.trace('no offers made');
    start();
  }
  logger.trace(offers);
  // anything to debug ...
  start();

}

function checkEmployee(callback: Function){
  if (loggedUser && loggedUser.role === 'Employee'){
    callback();
  } else {
    logger.warn('not permitted. login as an employee');
    start();
  }
}

function checkCustomer(callback: Function){
  if (loggedUser && loggedUser.role === 'Customer'){
    callback();
  } else {
    logger.info('login as a customer');
    start();
  }
}

function checkUser(callback: Function){
  if (loggedUser){
    callback();
  } else {
    logger.trace('login');
    start();
  }
}

// 1
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
          if (ans4 ==='Employee'){role === 'Employee'}
          register(username, password, money, role, start);
        })
       
      })
    })
  })
}

// 2
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

// 3 displayContents
//4 add Car


//5 view payments


//6 accept or reject offer


//7 restock

export function restock() {
  displayContents('dealer', start);
  logger.trace('Attempting Restock');
  rl.question('restock or remove? +/-', inc =>{

    rl.question('Restock which? ', (answer) => {
      // sanitize answer
      let car_id = Number(answer);
      getByKeys('dealer', car_id, (item: Inventory) => {
        logger.debug('item: ', item);
        if(!item){
          console.log('item not found');
          start();
        }
        if(!item.stock){
          item.stock =0;
        }
        if(item.stock ===0 && inc === '-'){
          console.log('item not found');
          start();
        }
        if(inc==='+'){
          item.stock++;
        }
        if (inc ==='-'){
          item.stock--;
        }
        updateItem(item, start);
        });
      });
  })
}


// 8 make an offer
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
        console.log(displayOffer(offer));
      }
    })
  }
  else {
    offers.forEach(offer => {
      console.log(displayOffer(offer));
    })
  }
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
function rejectOneOffer(id: number){
  // reject only one offer
  offers = offers.filter(offer => offer.id != id);
}
function rejectAllOffer(c_id: number){
  // reject only one offer
  offers = offers.filter(offer => offer.car_id != c_id);
}



function processOffer(){
  // save selected in user, dealership db ...
  let selected : Offer | null;
  printOffers();
  rl.question(`Which offer do you accept? (id) `, id => {
    // sanitize id

    if(offers.length==0){
      start();
    }
    selected = acceptOffer(Number(id));
    logger.debug(selected);
    logger.debug(offers);


    if (selected){
      rejectAllOffer(selected.car_id);
      let payments: Payment_Info;
      let price = selected.o_pr;
      let downpayment = selected.d_p;
      let loan = selected.o_pr - selected.d_p;
      let monthly_payment = loan / selected.mon;
      let payments_made = 0;
      let mon_financing= selected.mon;
      let car_id =selected.car_id
      payments={
        price, downpayment, loan, 
        monthly_payment, payments_made, mon_financing
      }

      getUserByName(selected.name).then(user => {
        if (user && selected && user.money && user.money>= selected.d_p){
          user.money -= payments.downpayment;
          // update dealership, user info
          getByKeys('dealer', car_id, (selection: Inventory) => {
            if(selection.stock && selection.stock >0){
              selection.stock--;
              updateUser(user);
              updateItem(selection, () => {
                logger.debug('after updating item: ', selection);
                selection.owner = user.name;
                selection.price =price;
                selection.payment_info = payments;
                selection.stock = undefined;
                createItem(selection, start);
              });

            }
          })
       }
      })
    };
  });
}
  






// 5, 9 payment info  getItemsForDisplay ... 

function paymentInfo(){

  if(!loggedUser){
    console.log('login to view payment info');
    start();
  }
  if(loggedUser && loggedUser.role ==='Customer'){
      // view remaining payments
      displayPayments(loggedUser.name, start);
  }
  if(loggedUser && loggedUser.role==='Employee'){
      // view all payments for customer
      rl.question('customer name? ', ans => {
          getUserByName(ans).then(user => {
              if(user){
                  displayPayments(user.name, start);
              }
              else { console.log('error')}
          }).catch(err=> {
              console.log('err: user ' + ans + ' cannot be found');
              start();
          })

      })
  }

}
  





function exit(){
  process.exit(0);
}

function logout(callback: Function){
  loggedUser = null;
  callback();
}